from store.models import Category, Product
from django.core.files.base import ContentFile
import requests

def run():
    # Create Categories
    cats = ['Necklaces', 'Rings', 'Earrings', 'Bracelets']
    
    for cat_name in cats:
        Category.objects.get_or_create(name=cat_name)

    print("Categories created.")

    # Create dummy products
    c = Category.objects.first()
    if c:
        for i in range(5):
            Product.objects.create(
                category=c,
                name=f"Sample Product {i}",
                description="This is a beautiful handcrafted piece.",
                price=100.00 + (i * 10),
                stock=10
            )
    print("Products created.")

if __name__ == '__main__':
    run()
