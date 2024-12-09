from django.urls import path
from namas import views

urlpatterns = [
    path('account/login', views.login_action, name='login'),
    path('account/register', views.register_action, name='register'),
    path('account/logout', views.logout_action, name='logout'),
    path('account/user', views.get_curr_user_action, name='get_curr_user'),
    path('checkout/create-payment', views.create_payment_intent),
    path('products', views.get_products_action, name='get_products'),
    path('products/page-count', views.get_page_count_action, name='get_page_count'),
    path('cart', views.cart_action, name='cart'),
    path('checkout', views.checkout_action, name='checkout'),
    path('orders', views.get_orders_action, name='get_orders'),
]
