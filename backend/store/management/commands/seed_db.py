import random
from django.core.management.base import BaseCommand
from store.models import Category, Product, ProductImage

class Command(BaseCommand):
    help = 'Seeds the database with initial data and images'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')
        
        # Create Categories
        cats = ['Necklaces', 'Rings', 'Earrings', 'Bracelets', 'Anklets']
        categories = []
        for i, cat_name in enumerate(cats):
            c, created = Category.objects.get_or_create(name=cat_name)
            
            # Add image to category if missing
            if not c.image:
                c.image = f"https://picsum.photos/seed/cat{i}/800/600"
                c.save()
                self.stdout.write(f'Added image to category: {cat_name}')
                
            categories.append(c)
            if created:
                self.stdout.write(f'Created category: {cat_name}')

        # Create Products
        adjectives = ['Golden', 'Silver', 'Diamond', 'Crystal', 'Pearl', 'Vintage']
        nouns = ['Charm', 'Drop', 'Loop', 'Sparkle', 'Bloom', 'Elegance']
        
        for i in range(20):
            cat = random.choice(categories)
            name = f"{random.choice(adjectives)} {random.choice(nouns)} {cat.name[:-1]}"
            
            product, created = Product.objects.get_or_create(
                name=name,
                defaults={
                    'category': cat,
                    'description': f"This is a beautiful handcrafted {name.lower()}.",
                    'price': random.randint(500, 5000),
                    'stock': random.randint(0, 50),
                    'is_available': True
                }
            )
            
            if created:
                self.stdout.write(f'Created product: {name}')
            
            # Ensure proper images exist
            if not product.images.exists():
                img_url = f"https://picsum.photos/seed/{product.id + 100}/800/800" 
                ProductImage.objects.create(product=product, image=img_url)
                self.stdout.write(f'Added image to: {name}')

        # Also fix any existing products without images
        for p in Product.objects.filter(images__isnull=True):
             img_url = f"https://picsum.photos/seed/{p.id + 555}/800/800"
             ProductImage.objects.create(product=p, image=img_url)
             self.stdout.write(f'Fixed missing image for: {p.name}')

        self.stdout.write(self.style.SUCCESS('Successfully seeded/updated database'))
