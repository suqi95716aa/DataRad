/* 下载图片 */
export function downloadImgFile(url: string, fileName: string = '未知文件') {
  const el = document.createElement('a')
  el.style.display = 'none'
  el.setAttribute('target', '_blank')
  el.setAttribute('download', fileName)
  el.href = url
  document.body.appendChild(el)
  el.click()
  document.body.removeChild(el)
}

// 下载blob文件
export function downloadBlobFile(blobFile: any, fileName: string) {
  if (!blobFile) {
    return
  }
  if (window.navigator?.msSaveOrOpenBlob) { // IE以及IE内核的浏览器
    try {
      window.navigator.msSaveOrOpenBlob(blobFile, fileName)
    } catch (e) {
      console.error(e)
    }
  } else {
    const url = window.URL.createObjectURL(blobFile)
		console.log('url---a', url)
    const link = document.createElement('a')
    link.style.display = 'none'
    link.href = url
    link.setAttribute('download', fileName)// 文件名
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link) // 下载完成移除元素
    window.URL.revokeObjectURL(url) // 释放掉blob对象
  }
}
