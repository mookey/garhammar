#!/bin/bash

ogr2ogr -f GeoJSON -where "adm0_a3 = 'JPN'" japan.json ne_10m_admin_1_states_provinces.shp
topojson -o japan.topo.json -q 1e6 --id-property adm1_cod_1 --properties name=name -- japan.json