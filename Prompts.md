# Singapore HDB Resale Price & Valuation Analytics — Prompt History

This document collates all chronological user prompts and requests provided during the project lifecycle.

---

### Prompt 1: Initial Application Specification
> Build a modern, interactive Singapore HDB Resale Price Analytics web app that allows users to explore historical HDB resale transactions, view property details and pricing trends across Singapore, filter transactions by town, flat type, floor area, transaction date and price range, and compare resale prices across different towns. Include interactive charts, summary statistics such as average and median resale prices, price per square foot (PSF), transaction volume and historical price trends, along with a searchable transaction table.
>
> Built only the front end. The HDB transaction API will be provided later and supports filtering by town and flat type only, so all other filters and analytics should be handled within the application using retrieved data.

---

### Prompt 2: API JSON Schema Alignment
> Reference the API JSON structure and revise the UI based on this expected API response:
>
> ```text
> Chen Mingyi, Edmund <chen_mingyie@yahoo.com>
> 2:26 PM (0 minutes ago)
> to gan.liling@gmail.com, me, zhaoxue0087@gmail.com, emilydebruijckere@gmail.com
>
> [
>     {
>         "_id": 238977,
>         "month": "2026-11",
>         "town": "TAMPINES",
>         "flat_type": "4 ROOM",
>         "block": "809",
>         "street_name": "TAMPINES AVE 4",
>         "storey_range": "07 TO 09",
>         "floor_area_sqm": "105.00",
>         "flat_model": "Model A",
>         "lease_commence_date": "1984",
>         "remaining_lease": "56 years 05 months",
>         "resale_price": "668000"
>     },
>     {
>         "_id": 239057,
>         "month": "2026-11",
>         "town": "TAMPINES",
>         "flat_type": "4 ROOM",
>         "block": "496G",
>         "street_name": "TAMPINES AVE 9",
>         "storey_range": "07 TO 09",
>         "floor_area_sqm": "106.00",
>         "flat_model": "Model A",
>         "lease_commence_date": "1993",
>         "remaining_lease": "65 years 10 months",
>         "resale_price": "625888"
>     },
>     {
>         "_id": 239066,
>         "month": "2026-11",
>         "town": "TAMPINES",
>         "flat_type": "4 ROOM",
>         "block": "505",
>         "street_name": "TAMPINES CTRL 1",
>         "storey_range": "04 TO 06",
>         "floor_area_sqm": "103.00",
>         "flat_model": "Model A",
>         "lease_commence_date": "1989",
>         "remaining_lease": "61 years 10 months",
>         "resale_price": "780000"
>     },
>     {
>         "_id": 239088,
>         "month": "2026-11",
>         "town": "TAMPINES",
>         "flat_type": "4 ROOM",
>         "block": "524B",
>         "street_name": "TAMPINES CTRL 7",
>         "storey_range": "01 TO 03",
>         "floor_area_sqm": "93.00",
>         "flat_model": "Model A",
>         "lease_commence_date": "2015",
>         "remaining_lease": "87 years 11 months",
>         "resale_price": "745000"
>     },
>     {
>         "_id": 239106,
>         "month": "2026-11",
>         "town": "TAMPINES",
>         "flat_type": "4 ROOM",
>         "block": "519A",
>         "street_name": "TAMPINES CTRL 8",
>         "storey_range": "13 TO 15",
>         "floor_area_sqm": "83.00",
>         "flat_model": "DBSS",
>         "lease_commence_date": "2014",
>         "remaining_lease": "86 years 08 months",
>         "resale_price": "885888"
>     }
> ]
> ```

---

### Prompt 3: Valuation Assessment Feature
> can you include a valuation assessment?

---

### Prompt 4: GitHub Repository Push
> push https://[GITHUB_TOKEN]@github.com/david-boh/hdb-valuation-checker.git

---

### Prompt 5: Serverless Live Connection & Endpoints
> 1. Add a serverless connection that pulls live data using the following endpoints:
>    `https://data.gov.sg/api/action/datastore_search?resource_id=d_8b84c4ee58e3cfc0ece0d773c8ca6abc`
>
>    All requests need the header: `AccountKey:`
>
> 2. Store this in `/api` folder (at project root level)
>
> 3. Include a `/health.ts` and `/carparkavailability.ts`

---

### Prompt 6: Endpoint Cleanup
> Can you remove carparkavailability.ts, as this is not relevant. remove only this and keep the rest intact

---

### Prompt 7: Prompt Documentation
> Collate all the prompts into filename Prompts.md
