from rest_framework import serializers
from django.core.validators import RegexValidator
from .models import Product, ProductImage, Cart, CartItem, Order

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    # write_only prevents the password from being returned in any response
    password = serializers.CharField(write_only=True, required=True)

class RegisterSerializer(serializers.Serializer):
    first_name = serializers.CharField(required=True)
    last_name = serializers.CharField(required=True)
    email = serializers.EmailField(required=True)
    # write_only prevents the password from being returned in any response
    password = serializers.CharField(write_only=True, required=True, validators=[
        RegexValidator(
            regex=r'^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$',
            message="Password must be at least 8 characters long, contain one uppercase letter, one digit, and one special character."
        )
    ])
    confirm_password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        errors = {}
        if data['password'] != data['confirm_password']:
            # give a custom error name and message if the passwords don't match
            errors['confirm_password'] = "Password and confirm password mismatch."
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return data

class ProductSerializer(serializers.ModelSerializer):
    # Use SerializerMethodField to get image URL
    images = serializers.SerializerMethodField()

    class Meta:
        model = Product
        # TODO: decide which fields will be passed in the response
        fields = ['product_id', 
                  'name', 
                  'images',
                  'price', 
                  'category', 
                  'description', 
                  'inventory', 
                  'rating',
                  'beads',]
        
    def get_images(self, obj):
        # Get all related ProductImage instances and return their URLs
        images = ProductImage.objects.filter(product=obj)
        return [image.image.url for image in images if image.image]

class CartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.ReadOnlyField(source='product.product_id')
    name = serializers.ReadOnlyField(source='product.name')
    price = serializers.ReadOnlyField(source='product.price')
    category = serializers.ReadOnlyField(source='product.category')
    beads = serializers.ReadOnlyField(source='product.beads')
    images = serializers.SerializerMethodField()
    inventory = serializers.ReadOnlyField(source='product.inventory')

    class Meta:
        model = CartItem
        fields = ['product_id', 
                  'name', 
                  'price', 
                  'category', 
                  'quantity',
                  'inventory',
                  'images',
                  'beads',]
    
    def get_images(self, obj):
        # Get all related ProductImage instances and return their URLs
        images = ProductImage.objects.filter(product=obj.product)
        return [image.image.url for image in images if image.image]

class CartSerializer(serializers.ModelSerializer):
    cart_items = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['cart_items']

    def get_cart_items(self, obj):
        # Get all related CartItem instances and return their serialized data
        cart_items = CartItem.objects.filter(cart=obj)
        return CartItemSerializer(cart_items, many=True).data

class OrderSerializer(serializers.ModelSerializer):
    class Meta:
        model = Order
        fields = ['order_id', 'user', 'amount', 'shipping_address', 'status', 'created_at', 'items']