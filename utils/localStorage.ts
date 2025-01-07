export const setLocalItem = (key: string, value: any) => {
      return window.localStorage.setItem(key, JSON.stringify(value))
    }
    export const getLocalItem = (key: string) => {
     const data = window.localStorage.getItem(key)
     return data ? JSON.parse(data) : null
    }