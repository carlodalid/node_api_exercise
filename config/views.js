var views = {
  index_name: '_design/timestamp_index',
  index_view: { 
    timestamp_index: {
      map: {
        fields: {
          timestamp: "asc"
        }
      },
      reduce: "_count",
      options: {
        def: {
          fields: [ "timestamp" ]
        }
      }
    }
  }
}

module.exports = views;
