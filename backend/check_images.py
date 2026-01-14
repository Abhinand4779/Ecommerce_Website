import os
import django
import sys

# Add the backend directory to sys.path
sys.path.append(r'c:\Users\HP\OneDrive\Desktop\CODEEE\backend')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_backend.settings')
django.setup()

from store.models import ProductImage

images = ProductImage.objects.all()[:5]
print(f"Found {ProductImage.objects.count()} images.")
for img in images:
    print(f"Image URL: {img.image}")
    # accessing attributes of the ImageFieldFile
    if hasattr(img.image, 'url'):
         print(f"Image .url attribute (if local): {img.image.url}")
