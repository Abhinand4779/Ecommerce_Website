from django.test import TestCase
from .models import Category

class CategoryHierarchyTest(TestCase):
    def setUp(self):
        self.root = Category.objects.create(name="Root", slug="root")
        self.sub = Category.objects.create(name="Sub", slug="sub", parent=self.root)
        self.sub_sub = Category.objects.create(name="SubSub", slug="sub-sub", parent=self.sub)

    def test_hierarchy(self):
        self.assertEqual(self.sub.parent, self.root)
        self.assertEqual(self.sub_sub.parent, self.sub)
        self.assertIn(self.sub, self.root.children.all())
        self.assertIn(self.sub_sub, self.sub.children.all())

    def test_recursive_relationship(self):
        # Verify we can traverse up
        self.assertEqual(self.sub_sub.parent.parent, self.root)
