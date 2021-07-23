module.exports = {
  siteMetadata: {
    title: `Massachusetts COVID-19 Cases by Town`,
    description: `An interactive app for viewing town-by-town case trends`,
    author: `Ryan Bagwell <ryan@ryanbagwell.com>`,
    siteUrl: `https://www.matowncovidcases.com`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `townData`,
        path: `${__dirname}/src/data/towns`,
      },
    },
    // {
    //   resolve: `gatsby-source-filesystem`,
    //   options: {
    //     name: `schoolData`,
    //     path: `${__dirname}/src/data/schools`,
    //   },
    // },
    {
      resolve: `gatsby-transformer-excel`,
      options: {
        raw: false,
      },
    },
    `gatsby-transformer-sharp`,
    `gatsby-plugin-sharp`,
    `gatsby-plugin-material-ui`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        serialize: ({ path, modifiedGmt }) => {
          const d = new Date()
          return {
            url: path,
            lastmod: d.toUTCString(),
          }
        },
      },
    },
    `gatsby-plugin-force-trailing-slashes`,
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/virus-outline.png`,
      },
    },
    {
      resolve: `gatsby-plugin-google-analytics`,
      options: {
        trackingId: "UA-105077064-2",
      },
    },
  ],
}
