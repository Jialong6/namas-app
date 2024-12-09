from django.contrib import admin
from .models import Profile, Product, ProductImage, Cart, CartItem, Order
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin

class UserAdmin(BaseUserAdmin):
    # the fields to be used in displaying the User model.
    list_display = ('id', 'username', 'email', 'first_name', 'last_name', 'is_staff')

# display name and other field of product in the admin management page
class ProductAdmin(admin.ModelAdmin):
    list_display = ('pk', 'name', 'price', 'category', 'inventory')
    search_fields = ('pk', 'name', 'category')

# display product information for cart items in the management page
class CartItemAdmin(admin.ModelAdmin):
    list_display = ('product_id', 'product_name', 'product_category', 'quantity')
    search_fields = ('product__name', 'product__category')

    def product_id(self, obj):
        return obj.product.pk
    product_id.short_description = 'Product ID'

    def product_name(self, obj):
        return obj.product.name
    product_name.short_description = 'Product Name'

    def product_category(self, obj):
        return obj.product.category
    product_category.short_description = 'Product Category'


# Register your models here.
admin.site.register(Product, ProductAdmin)
admin.site.register(ProductImage)
admin.site.register(Cart)
admin.site.register(CartItem, CartItemAdmin)

# remove the defualt registration of the user model and register it with the custom UserAdmin
admin.site.unregister(User)
admin.site.register(User, UserAdmin)