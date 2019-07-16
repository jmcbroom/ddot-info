# ddot.info gatsby material ui rewrite

## Tasks

How can we keep this running smoothly with service changes? Ideally this would run hand in hand with the updates to Heroku.

1. Get the [new GTFS](https://data.detroitmi.gov/api/views/y62d-bvsz/files/ed2bb596-1ff6-4e38-88be-dc4427c5afb7?filename=ddot_gtfs.zip) This usually happens through e-mail and then we post it to the open data portal, although it does get posted to detroitmi.gov as well.

2. Bring the new GTFS into Postgres. We can use https://github.com/fitnr/gtfs-sql-importer

3. Clean up the data:
  - copy stop names and location over from Tiffany's good file
  - routes: route name, route number, custom meta stuff
  - trip headsigns
  - timepoints (still manual)
  - route shapes? (AGO? Mapbox style/tileset?)

4. Apply functions that we don't get for free with the sql-importer.
  - nearby transfers
  - stops-to-routes

5. Run `gatsby build`

6. Redeploy

## How to use

Download the example [or clone the repo](https://github.com/mui-org/material-ui):

```sh
curl https://codeload.github.com/mui-org/material-ui/tar.gz/master | tar -xz --strip=2  material-ui-master/examples/gatsby
cd gatsby
```

Install it and run:

```sh
npm install
npm run develop
```

## The idea behind the example

[Gatsby](https://github.com/gatsbyjs/gatsby) is a static site generator for React.
