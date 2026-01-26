// Debug utilities for troubleshooting

export const debugReportData = (reports: any[], source: string) => {
  console.log(`=== ${source} - Report Data Debug ===`)
  console.log('Total reports:', reports.length)
  
  reports.forEach((report, index) => {
    console.log(`\nReport ${index + 1}:`)
    console.log('  ID:', report.id)
    console.log('  Type:', report.type)
    console.log('  Status:', report.status)
    console.log('  Location:', {
      address: report.location?.address,
      latitude: report.location?.latitude,
      longitude: report.location?.longitude
    })
    console.log('  Before Photos:', {
      count: report.beforePhotos?.length || 0,
      sample: report.beforePhotos?.[0]?.substring(0, 50) + '...' || 'None'
    })
    console.log('  After Photos:', {
      count: report.afterPhotos?.length || 0,
      sample: report.afterPhotos?.[0]?.substring(0, 50) + '...' || 'None'
    })
    console.log('  Reported At:', report.reportedAt)
    console.log('  Completed At:', report.completedAt || 'Not completed')
  })
  
  console.log('=== End Debug ===\n')
}

export const clearAllReports = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('reports')
    console.log('All reports cleared from localStorage')
  }
}

export const addTestReport = () => {
  if (typeof window !== 'undefined') {
    const testReport = {
      id: Date.now().toString(),
      type: 'pothole',
      description: 'Test pothole report',
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: '123 Test Street, New York, NY'
      },
      beforePhotos: [
        'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/8A8A'
      ],
      afterPhotos: [],
      priority: 'medium',
      status: 'reported',
      reportedBy: 'Test User',
      reportedAt: new Date().toISOString(),
      aiAnalysis: {
        detectedDamage: ['pothole'],
        confidence: 0.85,
        recommendedDepartment: 'Public Works'
      }
    }
    
    const existingReports = JSON.parse(localStorage.getItem('reports') || '[]')
    existingReports.push(testReport)
    localStorage.setItem('reports', JSON.stringify(existingReports))
    console.log('Test report added to localStorage')
  }
}
