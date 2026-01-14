import os
import django
import sys
import json

# Add the backend directory to sys.path
sys.path.append(r'c:\Users\HP\OneDrive\Desktop\CODEEE\backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_backend.settings')
django.setup()

from store.models import Product
from store.serializers import ProductSerializer

product = Product.objects.first()
if product:
    serializer = ProductSerializer(product)
    print(json.dumps(serializer.data, indent=2))
else:
    print("No products found")
