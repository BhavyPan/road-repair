// Utility functions for photo handling

export const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
      console.log('Photo converted to base64:', file.name, 'size:', file.size)
      resolve(reader.result as string)
    }
    reader.onerror = error => {
      console.error('Error converting photo to base64:', error)
      reject(error)
    }
  })
}

export const isValidPhotoUrl = (photo: string): boolean => {
  if (!photo) return false
  try {
    return (
      photo.startsWith('blob:') || 
      photo.startsWith('http') || 
      photo.startsWith('data:') ||
      photo.startsWith('blob:http')
    )
  } catch {
    return false
  }
}

export const logPhotoData = (photos: string[], label: string) => {
  console.log(`${label} - Total photos:`, photos.length)
  photos.forEach((photo, index) => {
    const isValid = isValidPhotoUrl(photo)
    const type = photo.startsWith('data:') ? 'Base64' : 
                  photo.startsWith('blob:') ? 'Blob URL' : 
                  photo.startsWith('http') ? 'HTTP URL' : 'Unknown'
    console.log(`  Photo ${index + 1}: ${type}, Valid: ${isValid}, Length: ${photo.length}`)
  })
}
