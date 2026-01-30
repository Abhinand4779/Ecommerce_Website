import os
import django

# Set up Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'jewelry_backend.settings')
django.setup()

from store.models import Category

def seed_categories():
    data = {
        "Necklaces": [
            "Terracotta Necklace", "Silver Necklace", "Gold Necklace", 
            "Diamond Necklace", "Pearl Necklace", "Choker"
        ],
        "Rings": [
            "Engagement Rings", "Wedding Bands", "Promise Rings", 
            "Fashion Rings", "Stackable Rings"
        ],
        "Earrings": [
            "Stud Earrings", "Hoop Earrings", "Drop Earrings", 
            "Dangle Earrings", "Ear Cuffs"
        ],
        "Bracelets": [
            "Charm Bracelets", "Bangles", "Cuffs", 
            "Tennis Bracelets", "Beaded Bracelets"
        ],
        "Anklets": [
            "Beaded Anklets", "Chain Anklets", "Charm Anklets", 
            "Sterling Silver Anklets"
        ]
    }

    for root_name, subs in data.items():
        # Get or create root category
        root, created = Category.objects.get_or_create(
            name=root_name,
            defaults={'slug': root_name.lower().replace(' ', '-')}
        )
        if created:
            print(f"Created root category: {root_name}")
        else:
            print(f"Root category exists: {root_name}")

        for sub_name in subs:
            sub, sub_created = Category.objects.get_or_create(
                name=sub_name,
                parent=root,
                defaults={'slug': sub_name.lower().replace(' ', '-')}
            )
            if sub_created:
                print(f"  Created sub-category: {sub_name}")
            else:
                print(f"  Sub-category exists: {sub_name}")

if __name__ == "__main__":
    seed_categories()
    print("Seeding complete!")
