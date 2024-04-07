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
