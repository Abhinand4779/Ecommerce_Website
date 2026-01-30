
import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_backend.settings')
django.setup()

from store.models import Category

print(f"Total Categories: {Category.objects.count()}")
for cat in Category.objects.all():
    parent_name = cat.parent.name if cat.parent else "None"
    print(f"ID: {cat.id}, Name: {cat.name}, Parent: {parent_name}")
