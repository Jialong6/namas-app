from django.db import models
from django.contrib.auth.models import User
import uuid
from django.core.exceptions import ValidationError

class Profile(models.Model):
    """User Profile Table"""

    user = models.OneToOneField(
        User, related_name="profile", on_delete=models.CASCADE
    )
    street_address = models.CharField(max_length=255)
    city = models.CharField(max_length=255)
    state = models.CharField(max_length=255)
    zip_code = models.CharField(max_length=10)
    telephone = models.CharField(max_length=15)

class Product(models.Model):
    """Product Table"""

    BRACELET = 'bracelet'
    NECKLACE = 'necklace'
    RING = 'ring'
    CUSTOMIZED_BRACELET = 'customized_bracelet'
    BEAD = 'bead'
    
    CATEGORY_CHOICES = [
        (BRACELET, 'Bracelet'),
        (NECKLACE, 'Necklace'),
        (RING, 'Ring'),
        (CUSTOMIZED_BRACELET, 'Custom Bracelet'),
        (BEAD, 'Bead')
    ]

    product_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    name = models.CharField(max_length=255)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    description = models.TextField(null=True, blank=True)
    inventory = models.IntegerField()
    sales_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)

    # Using JSONField to store beads and their order for customization
    beads = models.JSONField(default=list, blank=True)  # Store bead UUIDs and order

    # make sure price is a number >= 0
    def clean(self):
        super().clean()

        # Check if the product category is "CUSTOMIZE_BRACELET"
        if self.category == Product.CUSTOMIZED_BRACELET:
            # Ensure that beads are provided and the list has exactly 12 beads
            if not self.beads or len(self.beads) != 12:
                raise ValidationError({'beads': "Customized bracelets must have exactly 12 beads."})

            # validate that each bead is valid (i.e., exists in the Bead table)
            for bead_info in self.beads:
                try:
                    bead = Product.objects.get(product_id=bead_info['bead_id'], category=Product.BEAD)
                except Product.DoesNotExist:
                    raise ValidationError({'beads': f"Bead with ID {bead_info['bead_id']} does not exist or is not a valid bead."})

        # Validate price to be non-negative
        if self.price < 0:
            raise ValidationError({'price': "Price must be a positive number."})

    def save(self, *args, **kwargs):
        # Save the product first to ensure it has a product ID
        super().save(*args, **kwargs)

        # Check if the product is a CUSTOMIZED_BRACELET and has no images
        if self.category == Product.CUSTOMIZED_BRACELET and not self.images.exists():
            # Add a default image
            ProductImage.objects.create(
                product=self,
                image="product_images/CustomizedBracelet_default.webp"
            )

class ProductImage(models.Model):
    """Product Image Table"""

    product = models.ForeignKey(
        Product, related_name="images", on_delete=models.CASCADE
    )
    image = models.ImageField(upload_to="product_images/")
    uploaded_at = models.DateTimeField(auto_now_add=True)

class Cart(models.Model):
    """Cart Table"""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.OneToOneField(
        User, 
        # primary_key=True,  # user is the primary key
        related_name="cart", 
        on_delete=models.CASCADE
    )

class CartItem(models.Model):
    """Cart Item Table"""
    cart = models.ForeignKey(Cart, related_name="items", on_delete=models.CASCADE)
    product = models.ForeignKey(
        Product, related_name="cart_items", on_delete=models.CASCADE
    )
    quantity = models.IntegerField(default=0)
    
class Order(models.Model):
    """Order Table"""

    class Status(models.TextChoices):
        PENDING = "pending"
        SHIPPED = "shipped"
        DELIVERED = "delivered"
        CANCELLED = "cancelled"

    order_id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(
        User, related_name="orders", on_delete=models.CASCADE
    )
    amount = models.DecimalField(max_digits=10, decimal_places=2)
    shipping_address = models.TextField(blank=True, null=True)
    status = models.CharField(
        max_length=255, choices=Status.choices, default=Status.PENDING
    )
    created_at = models.DateTimeField(auto_now_add=True)
    items = models.JSONField(default=list)  # Store product ID, name, image, quantity, and price


# class OrderItem(models.Model):
#     """Order Item Table"""

#     order = models.ForeignKey(Order, on_delete=models.CASCADE)
#     product = models.ForeignKey(
#         Product, related_name="order_items", on_delete=models.CASCADE
#     )
#     quantity = models.IntegerField()
#     price = models.DecimalField(max_digits=10, decimal_places=2)