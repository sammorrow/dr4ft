let d = React.DOM

export let STRINGS = {
  BRANDING: {
    SITE_TITLE: ['dr4ft','com'].join('.'),
    SITE_NAME: d.span({},'DR',d.img({src:'4.png',alt:'4'}),'FT', d.img({src:'imscoutin.jpg',alt:"i'm scoutin'"})),
    DEFAULT_USERNAME: 'obie',
    PAYPAL: '',
  },

  PAGE_SECTIONS: {
    MOTD: null, // message of the day; can be a React element

    FOOTER: d.div({},
      d.strong({}, 'kep-dr4ft-boiz'),
      ' is a fork of a fork of the ',
      d.code({}, 'drafts.ninja'),
      ' arxanas fork of the ',
      d.code({}, 'draft'),
      ' project by aeosynth. Contributions welcome! ',
      d.a({ href: 'https://github.com/dr4fters/dr4ft' },
        'https://github.com/dr4fters/dr4ft')),
  },
}
