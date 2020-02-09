// Pug won't interpolate most attributes including an input of type Date's value
// which attribute is called valueAsDate. This value can be passed and will be interpreted as
// <input type="date" valueasdate=datestring> but the element as rendered will be an empty date-picker
export default function logDateFiller() {
    const el = document.querySelector('input[name="dateStarted"]')
    if (!el) return
    el.valueAsDate = new Date(el.attributes.unformatteddate.value)

    const el2 = document.querySelector('input[name="dateCompleted"]')
    el2.valueAsDate = new Date(el2.attributes.unformatteddate.value)
}
