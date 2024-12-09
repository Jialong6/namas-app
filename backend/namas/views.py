from .serializers import LoginSerializer, RegisterSerializer, CartSerializer, OrderSerializer, ProductSerializer, CartItemSerializer
import json
import os
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import stripe
import math

from .models import Product, Cart, CartItem, Order

PAGE_SIZE = 10

from django.middleware.csrf import get_token
# get the CSRF token
def get_csrf_action(request):
    return JsonResponse({"csrfToken": get_token(request)})

# manage the login action, verify and authenticate the user
# @csrf_exempt  # Disable CSRF protection just for test purposes
def login_action(request):
    if request.method != "POST":
        # Return an error for non-POST requests
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    # Parse JSON body
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        # Return an error for invalid JSON
        return JsonResponse(
            {"success": False, "message": "Invalid JSON."}, status=400
        )

    # Initialize the serializer with the incoming data
    serializer = LoginSerializer(data=data)

    # Check if the data is valid
    if not serializer.is_valid():
        # Get the specific field errors
        field_errors = serializer.errors

        # Return an error response for invalid data
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid data.",
                "errors": field_errors,
            },
            status=400,
        )

    # Extract validated data
    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]

    # Authenticate the user
    user = authenticate(username=email, password=password)

    if user is not None:
        # Log in the user and return a success response
        login(
            request, user, backend="django.contrib.auth.backends.ModelBackend"
        )
        return JsonResponse(
            {"success": True, "message": "Login successful."}, status=200
        )
    else:
        # Return an error response for invalid credentials
        return JsonResponse(
            {"success": False, 
             "message": "Login failed.",
             "errors": {
                 "non_field_errors": ["Invalid email or password."]
             }},
            status=400,
        )


# manage the register action, create a new user
# @csrf_exempt  # Disable CSRF protection just for test purposes
def register_action(request):
    if request.method != "POST":
        # Return an error for non-POST requests
        return JsonResponse(
            {"success": False, 
             "errors": {
                 "method": "Invalid request method."
             }}, status=405
        )

    # Parse JSON body
    try:
        data = json.loads(request.body)
    except json.JSONDecodeError:
        # Return an error for invalid JSON
        return JsonResponse(
            {"success": False, 
             "errors": {
                    "json": "Invalid JSON."
             }}, status=400
        )

    # Initialize the serializer with the incoming data
    serializer = RegisterSerializer(data=data)

    # Check if the data is valid
    if not serializer.is_valid():
        # Get the specific field errors
        field_errors = serializer.errors

        # Return an error response for invalid data
        return JsonResponse(
            {
                "success": False,
                "message": "Invalid data.",
                "errors": field_errors,
            },
            status=400,
        )

    # Extract validated data
    email = serializer.validated_data["email"]
    password = serializer.validated_data["password"]
    first_name = serializer.validated_data["first_name"]
    last_name = serializer.validated_data["last_name"]

    # Check if user already exists
    user = authenticate(username=email, password=password)
    if user is not None:
        # Return an error response for existing user
        return JsonResponse(
            {"success": False, 
             "message": "User with this email already exists.",
             "errors": {
                 "email": ["User with this email already exists."]
             }}, status=400
        )

    # Create a new user
    user = User.objects.create_user(
        username=email,
        email=email,
        first_name=first_name,
        last_name=last_name,
        password=password,
    )

    # Log in the user
    login(request, user, backend="django.contrib.auth.backends.ModelBackend")

    # Return a success response
    return JsonResponse(
        {"success": True, "message": "User registered successfully."},
        status=200,
    )


# manage the logout action, log out the user
# @csrf_exempt  # Disable CSRF protection just for test purposes
def logout_action(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    try:
        logout(request)
    except Exception as e:
        return JsonResponse(
            {"success": False, "message": f"Error logging out: {e}"}, status=401
        )
    return JsonResponse(
        {"success": True, "message": "Logout successful."}, status=200
    )


# manage the get current user action, return the current user
# @csrf_exempt  # Disable CSRF protection just for test purposes
def get_curr_user_action(request):
    if request.method != "GET":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    if request.user.is_authenticated:
        return JsonResponse(
            {
                "success": True,
                "message": "User is authenticated.",
                "user": {
                    "id": request.user.id,
                    "email": request.user.email,
                    "first_name": request.user.first_name,
                    "last_name": request.user.last_name,
                },
            },
            status=200,
        )
    else:
        return JsonResponse(
            {"success": False, "message": "User is not authenticated."},
            status=401,
        )


# Extract the items from the request body and create a payment intent
# @csrf_exempt  # Disable CSRF protection just for test purposes
def create_payment_intent(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    try:
        # Parse the incoming request data
        cart_items = json.loads(request.body)
        items = cart_items.get("items", [])

        # Calculate the order amount in cents
        amount = sum(int(float(item["price"]) * 100) * item["quantity"] for item in items)

        # Get the Stripe secret key from the environment variables
        stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

        # Create a PaymentIntent
        payment_intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="usd",
            automatic_payment_methods={"enabled": True},
        )

        # Send the client secret back to the frontend
        return JsonResponse({"clientSecret": payment_intent.client_secret})
    except Exception as e:
        print("Error creating payment intent:", e)
        return JsonResponse(
            {"success": False, "message": "PaymentIntent creation failed"},
            status=500,
        )
    

# @csrf_exempt
def get_page_count_action(request):
    if request.method != "GET":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    # Get filter and sort parameters
    product_type = request.GET.get("type", None)
    price_min = request.GET.get("price_min", None)
    price_max = request.GET.get("price_max", None)

    # Filter products
    products = Product.objects.all()
    if product_type:
        products = products.filter(category=product_type)
    else:
        # Exclude customized_bracelet and bead products when the type is not specified
        products = Product.objects.exclude(category__in=["customized_bracelet", "bead"])
    if price_min:
        products = products.filter(price__gte=price_min)
    if price_max:
        products = products.filter(price__lte=price_max)
    # Discard products with inventory 0
    products = products.filter(inventory__gt=0)
    # Get the total number of products
    total_products = products.count()
    # Calculate the total number of pages
    page_count = math.ceil(total_products / PAGE_SIZE)

    return JsonResponse({"success": True, "pages": page_count}, status=200)

@csrf_exempt  # Disable CSRF protection just for test purposes
def get_products_action(request):
    if request.method != "GET":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )
    
    # Return the information of a single product if the product_id is provided
    product_id = request.GET.get("product_id", None)
    if product_id:
        try:
            product = Product.objects.get(product_id=product_id)
            serializer = ProductSerializer(product)
            return JsonResponse(
                {"success": True, "product": serializer.data}, status=200
            )
        except Product.DoesNotExist:
            return JsonResponse(
                {"success": False, "message": "Product not found."}, status=404)
    
    # Get filter and sort parameters
    product_type = request.GET.get("type", None)
    price_min = request.GET.get("price_min", None)
    price_max = request.GET.get("price_max", None)
    sort_by = request.GET.get("sort_by", "sales_count") # price, rating, sales_count (default), created_at
    order = request.GET.get("order", "desc") # asc or desc
    # get page number
    page = request.GET.get("page", 1)

    # Get products based on the filters
    products = Product.objects.all()
    if product_type:
        products = products.filter(category=product_type)
    else:
        # Exclude customized_bracelet and bead products when the type is not specified
        products = Product.objects.exclude(category__in=["customized_bracelet", "bead"])
    if price_min:
        products = products.filter(price__gte=price_min) 
    if price_max:
        products = products.filter(price__lte=price_max)

    # discard products with inventory 0
    products = products.filter(inventory__gt=0)

    # Sort the products
    if order == "asc":
        products = products.order_by(sort_by)
    else:
        products = products.order_by(f"-{sort_by}")

    # only return the products for the requested page
    if product_type != "bead":
        page = int(page)
        start = (page - 1) * PAGE_SIZE
        end = start + PAGE_SIZE
        products = products[start:end]

    # Serialize the products
    serializer = ProductSerializer(products, many=True)

    return JsonResponse(
        {"success": True, "products": serializer.data}, status=200
    )


# @csrf_exempt  # Disable CSRF protection just for test purposes
def cart_action(request):
    try:
        # Get the user's cart
        user = User.objects.get(id=request.user.id)

        if request.method == "GET":
            try:
                cart = Cart.objects.get(user=user)
            except Cart.DoesNotExist:
                return JsonResponse({'success': True, 
                                    'cart_items': []}, 
                                    status=200)

            # Get the cart items
            cart_items = cart.items.all()

            # Serialize the cart items
            serializer = CartItemSerializer(cart_items, many=True)

            return JsonResponse(
                {"success": True, "cart_items": serializer.data}, status=200
            )
        
        elif request.method == "POST":
            # Parse the incoming request data
            data = json.loads(request.body)

            try:
                cart, created = Cart.objects.get_or_create(user=user)
            except Exception as e:
                return JsonResponse({'success': False, 
                                    'message': str(e)}, 
                                    status=500)

            items = data.get('cart_items', [])  # Expecting 'cart_items' in the request body
            response_messages = []  # To track updates and mismatches

            # delete all old items in the cart
            cart.items.all().delete()
            
            for item in items:
                product_id = item.get('product_id')
                quantity = item.get('quantity')

                # Create a new product for new customized bracelet
                if (not product_id or product_id == '') and item.get('category') == Product.CUSTOMIZED_BRACELET:
                    product = Product.objects.create(
                        name="Custom Bracelet",
                        price=120, # each bead 10 USD, 12 bead in total
                        category=Product.CUSTOMIZED_BRACELET,
                        # description=item.get('description', 'Customized bracelet'),
                        inventory=quantity,
                        beads=item.get('beads', []),
                    )
                    product_id = product.product_id

                # Validate product existence
                try:
                    product = Product.objects.get(product_id=product_id)
                except Product.DoesNotExist:
                    continue  # Skip invalid products

                # Check stock and adjust quantity
                if product.inventory == 0:
                    # Remove item if product is out of stock
                    CartItem.objects.filter(cart=cart, product=product).delete()
                    response_messages.append(f"Product {product.name} is out of stock and removed from the cart.")
                    continue

                if quantity > product.inventory:
                    # Adjust quantity to match stock
                    quantity = product.inventory
                    response_messages.append(f"Product {product.name} quantity adjusted to available stock: {quantity}.")

                # Update or create the cart item
                CartItem.objects.update_or_create(
                    cart=cart,
                    product=product,
                    defaults={'quantity': quantity}
                )

            # Serialize the updated cart
            serializer = CartSerializer(cart)
            return JsonResponse({'success': True, 
                                'cart': serializer.data, 
                                'messages': response_messages}, 
                                status=200)
        
        return JsonResponse(
                {"success": False, 
                "message": "Invalid request method."}, 
                status=405
            )
    except Exception as e:
        return JsonResponse(
            {"success": False, "message": str(e)}, status=500
        )

# @csrf_exempt  # Disable CSRF protection just for test purposes
def checkout_action(request):
    if request.method != "POST":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    # Get the user's cart
    user = User.objects.get(id=request.user.id)
    try:
        cart = Cart.objects.get(user=user)
    except Cart.DoesNotExist:
        return JsonResponse(
            {"success": False, "message": "Cart not found."}, status=404
        )

    data = json.loads(request.body)

    # Get the cart items
    cart_items = cart.items.all()

    # Compute the order price
    total_price = sum(item.product.price * item.quantity for item in cart_items)

    # Check if the cart is empty
    if not cart_items:
        return JsonResponse(
            {"success": False, "message": "Cart is empty."}, status=400
        )

    # Prepare items for the order
    order_items = []
    for item in cart_items:
        order_items.append({
            "product_id": str(item.product.product_id),
            "name": item.product.name,
            "price": str(item.product.price),
            "quantity": item.quantity,
            "image": item.product.images.first().image.url if item.product.images.exists() else None,
            "beads": item.product.beads,
        })

    # Create the order
    order = Order.objects.create(
        user=user,
        amount=total_price,
        items=order_items,
        shipping_address=data.get('shipping_address', None)
    )

    # Clear the cart
    cart.items.all().delete()

    # Serialize and return the order
    serializer = OrderSerializer(order)
    return JsonResponse(
        {"success": True, "order": serializer.data}, status=200
    )


# @csrf_exempt  # Disable CSRF protection just for test purposes
def get_orders_action(request):
    if request.method != "GET":
        return JsonResponse(
            {"success": False, "message": "Invalid request method."}, status=405
        )

    try: 
        # Get the user's orders
        user = User.objects.get(id=request.user.id)
        orders = Order.objects.filter(user=user).order_by('-created_at')  # Sort by created_at in descending order

        # Serialize the orders
        serializer = OrderSerializer(orders, many=True)

        return JsonResponse(
            {"success": True, "orders": serializer.data}, status=200
        )
    except Exception as e:
        return JsonResponse(
            {"success": False, "message": str(e)}, status=500
        )
