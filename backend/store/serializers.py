from rest_framework import serializers
from .models import Category, Product, ProductImage, Color, Size, Slider, HomeGroup, Page, Country, State
from django.conf import settings

class ProductImageSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = ProductImage
        fields = ['id', 'image', 'is_feature']

    def get_image(self, obj):
        if obj.image:
            if obj.image.name.startswith('http'):
                return obj.image.name
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class CategorySerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    children = serializers.SerializerMethodField()
    
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'image', 'parent', 'children', 'is_active']

    def get_children(self, obj):
        serializer = CategorySerializer(obj.children.all(), many=True, context=self.context)
        return serializer.data

    def get_image(self, obj):
        if obj.image:
            if obj.image.name.startswith('http'):
                return obj.image.name
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class ColorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Color
        fields = '__all__'

class SizeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Size
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    images = ProductImageSerializer(many=True, read_only=True)
    uploaded_images = serializers.ListField(
        child=serializers.ImageField(max_length=1000000, allow_empty_file=False, use_url=False),
        write_only=True,
        required=False
    )
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True
    )
    colors = ColorSerializer(many=True, read_only=True)
    color_ids = serializers.PrimaryKeyRelatedField(
        queryset=Color.objects.all(), source='colors', many=True, write_only=True, required=False
    )
    sizes = SizeSerializer(many=True, read_only=True)
    size_ids = serializers.PrimaryKeyRelatedField(
        queryset=Size.objects.all(), source='sizes', many=True, write_only=True, required=False
    )
    
    class Meta:
        model = Product
        fields = [
            'id', 'name', 'slug', 'description', 'price', 'discount_price', 
            'category', 'category_id', 'images', 'uploaded_images', 'is_available',
            'colors', 'color_ids', 'sizes', 'size_ids', 'stock'
        ]

    def create(self, validated_data):
        uploaded_images = validated_data.pop('uploaded_images', [])
        colors = validated_data.pop('colors', [])
        sizes = validated_data.pop('sizes', [])
        product = Product.objects.create(**validated_data)
        product.colors.set(colors)
        product.sizes.set(sizes)
        for image in uploaded_images:
            ProductImage.objects.create(product=product, image=image)
        return product

class SliderSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    class Meta:
        model = Slider
        fields = '__all__'
    
    def get_image(self, obj):
        if obj.image:
            request = self.context.get('request')
            if request: return request.build_absolute_uri(obj.image.url)
            return obj.image.url
        return None

class HomeGroupSerializer(serializers.ModelSerializer):
    products = ProductSerializer(many=True, read_only=True)
    product_ids = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(), source='products', many=True, write_only=True
    )
    class Meta:
        model = HomeGroup
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Page
        fields = '__all__'

class CountrySerializer(serializers.ModelSerializer):
    class Meta:
        model = Country
        fields = '__all__'

class StateSerializer(serializers.ModelSerializer):
    country_name = serializers.ReadOnlyField(source='country.name')
    class Meta:
        model = State
        fields = '__all__'
