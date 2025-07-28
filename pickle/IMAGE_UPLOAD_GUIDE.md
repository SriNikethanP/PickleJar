# Image Upload Functionality Guide

## Overview

This guide explains the image upload functionality implemented for products in the PickleJar application. The system uses Cloudinary for image storage and supports base64 conversion for enhanced security and performance.

## Features

### ✅ **Core Features**

- **Multiple Image Upload**: Support for up to 3 images per product
- **Drag & Drop Interface**: Modern drag and drop functionality
- **Base64 Conversion**: Images are converted to base64 before upload
- **Cloudinary Integration**: Secure cloud storage with CDN
- **Real-time Previews**: Instant image previews before upload
- **File Validation**: Type and size validation
- **Progress Feedback**: Toast notifications for success/error states

### 🎯 **Technical Implementation**

## Frontend Components

### 1. **ImageUpload Component** (`picklejar/src/components/ImageUpload.tsx`)

A reusable component that provides:

- Drag and drop functionality
- File validation (type, size)
- Real-time previews
- Multiple file selection
- Remove individual images

**Props:**

```typescript
interface ImageUploadProps {
  images: File[];
  setImages: (images: File[]) => void;
  maxImages?: number; // Default: 3
  maxSize?: number; // Default: 10MB
  acceptedTypes?: string[]; // Default: ["image/jpeg", "image/jpg", "image/png", "image/webp"]
  className?: string;
}
```

### 2. **Cloudinary Utilities** (`picklejar/src/lib/util/cloudinary.ts`)

Enhanced utilities for Cloudinary integration:

```typescript
// Upload single file as base64
export const uploadBase64ImageToCloudinary = async (base64Data: string): Promise<CloudinaryUploadResult>

// Upload multiple files as base64
export const uploadMultipleFilesAsBase64ToCloudinary = async (files: File[]): Promise<CloudinaryUploadResult[]>

// Convert file to base64
export const fileToBase64 = (file: File): Promise<string>
```

## Backend Implementation

### 1. **Product Entity** (`pickle/src/main/java/com/pickle_company/pickle/entity/Product.java`)

```java
@ElementCollection(fetch = FetchType.LAZY)
@CollectionTable(name = "product_images", joinColumns = @JoinColumn(name = "product_id"))
@Column(name = "image_url")
@Builder.Default
private List<String> imageUrls = new ArrayList<>();
```

### 2. **Product Service** (`pickle/src/main/java/com/pickle_company/pickle/service/ProductService.java`)

Enhanced to handle image URLs from Cloudinary:

```java
// Handle image URLs from Cloudinary
if (dto.getImageUrls() != null && !dto.getImageUrls().isEmpty()) {
    if (productId != null) {
        // For updates, merge with existing images
        List<String> existingImages = new ArrayList<>(product.getImageUrls());
        existingImages.addAll(dto.getImageUrls());
        product.setImageUrls(existingImages);
    } else {
        // For new products, set the image URLs
        product.setImageUrls(dto.getImageUrls());
    }
}
```

## Usage Examples

### 1. **Adding Images to Product**

```typescript
import { addProduct } from "@lib/data/admin-new";
import ImageUpload from "@components/ImageUpload";

const [images, setImages] = useState<File[]>([]);

const handleSubmit = async () => {
  try {
    await addProduct(productData, images);
    toast.success("Product added successfully!");
  } catch (error) {
    toast.error("Failed to add product");
  }
};

// In JSX
<ImageUpload
  images={images}
  setImages={setImages}
  maxImages={3}
  maxSize={10}
/>;
```

### 2. **Updating Product Images**

```typescript
import { updateProduct } from "@lib/data/admin-new";

const handleUpdate = async () => {
  try {
    await updateProduct(productId, productData, newImages);
    toast.success("Product updated successfully!");
  } catch (error) {
    toast.error("Failed to update product");
  }
};
```

## Configuration

### 1. **Environment Variables**

Add these to your `.env.local`:

```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### 2. **Cloudinary Setup**

1. Create a Cloudinary account
2. Get your cloud name
3. Create an upload preset (unsigned)
4. Configure CORS settings if needed

## File Validation

### **Supported Formats**

- JPEG/JPG
- PNG
- WebP

### **Size Limits**

- Maximum file size: 10MB per image
- Maximum images per product: 3

### **Validation Rules**

```typescript
const validateFile = (file: File): boolean => {
  // Check file type
  if (!acceptedTypes.includes(file.type)) {
    toast.error(`Invalid file type. Please upload ${acceptedTypes.join(", ")}`);
    return false;
  }

  // Check file size
  if (file.size > maxSize * 1024 * 1024) {
    toast.error(`File size must be less than ${maxSize}MB`);
    return false;
  }

  return true;
};
```

## Security Features

### 1. **Base64 Conversion**

- Images are converted to base64 before upload
- Prevents direct file access
- Enhanced security for sensitive images

### 2. **Cloudinary Security**

- Secure HTTPS URLs
- Automatic image optimization
- CDN distribution for performance

### 3. **File Validation**

- Type checking
- Size validation
- Malicious file prevention

## Performance Optimizations

### 1. **Image Optimization**

- Cloudinary automatic optimization
- Responsive images
- WebP format support

### 2. **Lazy Loading**

- Images loaded on demand
- Reduced initial page load time

### 3. **Preview Management**

- Object URLs for previews
- Proper cleanup to prevent memory leaks

## Error Handling

### 1. **Upload Errors**

```typescript
try {
  const result = await uploadMultipleFilesAsBase64ToCloudinary(images);
  // Handle success
} catch (error) {
  toast.error("Failed to upload images");
  console.error("Upload error:", error);
}
```

### 2. **Validation Errors**

- File type validation
- File size validation
- Maximum image count validation

### 3. **Network Errors**

- Retry mechanisms
- Fallback options
- User-friendly error messages

## Database Schema

### **Product Images Table**

```sql
CREATE TABLE product_images (
    product_id BIGINT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    FOREIGN KEY (product_id) REFERENCES products(id)
);
```

## API Endpoints

### **Product Management**

- `POST /api/v1/products/admin` - Create product with images
- `PUT /api/v1/products/admin/{id}` - Update product with images
- `DELETE /api/v1/products/admin/{id}/images` - Delete specific image

## Best Practices

### 1. **Image Optimization**

- Use appropriate image formats
- Compress images before upload
- Consider responsive images

### 2. **User Experience**

- Provide clear feedback
- Show upload progress
- Allow image removal

### 3. **Security**

- Validate all uploads
- Use secure URLs
- Implement proper access controls

## Troubleshooting

### **Common Issues**

1. **Upload Fails**

   - Check Cloudinary configuration
   - Verify environment variables
   - Check file size limits

2. **Images Not Displaying**

   - Verify Cloudinary URLs
   - Check CORS settings
   - Validate image format

3. **Performance Issues**
   - Optimize image sizes
   - Use appropriate formats
   - Implement lazy loading

## Future Enhancements

### **Planned Features**

- Image cropping and editing
- Bulk image upload
- Advanced image optimization
- Image galleries
- Thumbnail generation

### **Performance Improvements**

- Progressive image loading
- Image caching strategies
- CDN optimization
- Compression algorithms

## Support

For issues or questions regarding image upload functionality:

1. Check the console for error messages
2. Verify Cloudinary configuration
3. Test with different image formats
4. Review network requests in browser dev tools
