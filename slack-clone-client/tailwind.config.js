module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
  },
  theme: {
    extend: {
      gridTemplateColumns: {
        // Simple 16 column grid
        16: "repeat(16, minmax(0, 1fr))",

        // Complex site-specific column configuration
        layout: "100px 250px 1fr",
      },
      gridTemplateRows: {
        layout: "auto 1fr auto",
        header: "38px 1fr",
      },
    },
    fill: (theme) => ({
      red: theme("color.red.primary"),
    }),
    colors: {
      white: "#ffffff",
      purple: {
        medium: "#4e3a4c",
        dark: "#362234",
      },
      team: {
        background: "#676066",
        borderColor: "#767676",
      },
      black: {
        light: "#262626",
        faded: "#00000059",
      },
      gray: {
        base: "#616161",
        background: "#fafafa",
        primary: "#dbdbdb",
      },
      red: {
        primary: "#ed4956",
      },
    },
  },
};
