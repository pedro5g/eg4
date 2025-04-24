export const spyOn = <T>(obj: T, method: keyof T) => {
  let count = 0

  const _original = obj[method]

  if (typeof _original === "function") {
    obj[method] = function () {
      count++
      //@ts-ignore
      return _original.apply(this, arguments)
    } as T[keyof T]
  }

  function called(times = 1) {
    return count >= times
  }

  function calleds() {
    return count
  }

  return {
    called,
    calleds,
  }
}
