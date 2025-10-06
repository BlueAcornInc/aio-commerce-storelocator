  async function main (params) {
    const { url, token } = params;
    const config = {
      baseUrl: `${configData.restApiBaseUrl}/inventory/source-items`,
      product: events._lastEvent?.["pdp/data"]?.payload ?? null,
    };
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };

    const data = fetch(
      `${url}?searchCriteria[filter_groups][0][filters][0][field]=sku&searchCriteria[filter_groups][0][filters][0][value]=${sku}&searchCriteria[filter_groups][0][filters][0][condition_type]=eq`,
      options
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        return responseData;
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    return data;
  };

  exports.main = main;
