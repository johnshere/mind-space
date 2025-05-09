interface View {
  default: {
    title: string
    match?: string
    __file: string
    children?: RouteRecordRaw[]
  }
}
