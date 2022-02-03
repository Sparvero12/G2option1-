// dependencies / things imported
import '@lrnwebcomponents/accent-card/accent-card.js';
import { LitElement, html, css } from 'lit';

export class NasaImageSearch extends LitElement {
  static get tag() {
    return 'image search';
  }


  constructor() {
    this.imageData = [];
    super();

  }


  static get properties() {
    return {

    };
  }


  updated(changedProperties) {
    // this is looping over an array of values that's keyed by property name == the old value
    // this is because you could always write this.whatever if "whatever" is the property name in question
    changedProperties.forEach((oldValue, propName) => {
      // see if the current property that we know changed, is called ip
      // also see if it has ANY value. We benefit from JS being lazy typed here because null
      // (our default value) will fail this test but ANY VALUE will pass it
      if (propName === 'data' && this[propName]) {

        this.dispatchEvent(evt);
      }
    });
  }

  getData() {
    const file = new URL('./response.json', import.meta.url).href;

    fetch(file)
      .then(response =>

        response.json()
      )
      .then(data => {
        this.imageData = [];

        for (let i = 0; i < data.length; i++) {

          const eventInfo = {
            name: data[i].details,
            location: data[i].location,
            start: data[i].start_time,
            end: data[i].end_time,
            order: data[i].order,
          };
          // brute force; just pull what looks like a date off the front for 01-31-22 format
          const startDate = new Date(eventInfo.start.split('T')[0]);
          // I googled "javascript ow to convert date string into..." and skipped around
          // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/DateTimeFormat
          eventInfo.month = new Intl.DateTimeFormat(document.lang, {
            month: 'short',
          }).format(startDate);
          eventInfo.day = new Intl.DateTimeFormat(document.lang, {
            weekday: 'short',
          }).format(startDate);
          eventInfo.date = startDate.getDate();
          // this is very lazy and very brute force
          eventInfo.start = eventInfo.start.split('T')[1].replace('-5:00', '');
          eventInfo.end = eventInfo.end.split('T')[1].replace('-5:00', '');
          // so you can see object printed to console
          console.log(eventInfo);
          this.dates.push(eventInfo);
        }
        // tell the browser to wait for 1 second before setting this back to what it was
        setTimeout(() => {
          this.loadData = false;
        }, 1000);
      });
  }

  /**
   * Async, so run this code in order though in this example
   * it'll run regardless since we're not doing other actions
   */
  async updateUserIP() {
    return fetch(this.ipLookUp)
      .then(resp => {
        if (resp.ok) {
          return resp.json();
        }
        return false;
      })
      .then(data => {

        return data;
      });
  }

  // styles that ONLY APPLY TO THIS CODE BLOCK
  // this capability is called ShadowRoot and
  // it ensures that the code in the render() method
  // will be the only thing to get these styles applied
  // certain things can go in but the styles can't bleed out
//   static get styles() {
//     return [
//       css`
//         /* :host is a special selector meaning the stlyes to apply to the tag itself, like defaults */
//         :host {
//           display: block;
//         }
//         /* an unorder list is a ul tag */
//         ul {
//           margin: 0 8px;
//           list-style-type: square;
//           font-size: 20px;
//         }
//         /* a list item in an ul or ol */
//         li {
//           margin: 0;
//           padding: 0;
//         }
//         .ipaddress {
//           /* This is a CSS variable meaning code external to this can style using this variable in CSS */
//           font-style: var(--user-ip-ipaddress-font-style, italic);
//         }
//       `,
//     ];
//   }

  // this serves very little purpose but at least we're rendering the info
  render() {
    return html` <ul>
      <li>

      </li>
    </ul>`;
  }
}

customElements.define(nasa-image-search.tag, NasaImageSearch);
