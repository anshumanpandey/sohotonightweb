export default (url: string) => {
    console.log({ url })
    const a = document.createElement('a')
    a.href = url
    a.setAttribute("download", url.split('/').pop() as string)
    a.setAttribute("target", "_blank")
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
}