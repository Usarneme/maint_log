// Pug won't interpolate most attributes including an input of type Date's value
// which attribute is called valueAsDate. This value can be passed and will be interpreted as
// <input type="date" valueasdate=datestring> but the element as rendered will be an empty date-picker
export default function logDateFiller() {
    // console.log('logDateFiller function...')
    // const datesContainer = document.querySelector(".dates")
    // console.log('datesContainer not found: '+datesContainer)

    // if (!datesContainer) return
    // console.log('datesContainer found: ')
    // console.dir(datesContainer)

    // datesContainer.children.forEach(dateInput => {
    //     if (dateInput.tagName.toLowerCase() === 'input') {
    //         console.log('Updating '+dateInput)
    //         dateInput.valueAsDate = new Date(dateInput.attributes.unformatteddate.value)
    //     }
    // })

    const el = document.querySelector('input[name="dateStarted"]')
    if (!el) return
    if (el.attributes.unformatteddate) el.valueAsDate = new Date(el.attributes.unformatteddate.value)

    const el2 = document.querySelector('input[name="dateCompleted"]')
    if (el2.attributes.unformatteddate) el2.valueAsDate = new Date(el2.attributes.unformatteddate.value)

    const el3 = document.querySelector('input[name="dateDue"]')
    if (el3.attributes.unformatteddate) el3.valueAsDate = new Date(el3.attributes.unformatteddate.value)
}
