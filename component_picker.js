jQuery(document).ready(function()
{
  var form  = jQuery("#components-search-form");
  var make  = jQuery("#vehicle_make_name");
  var model = jQuery("#vehicle_model_name");
  var year  = jQuery("#vehicle_year");
  var table = jQuery("#components-table");
  var search_path = "/components";

  // Build the search results table
  function fill_table(data)
  {
    var children = table.find("tr.data");
    children.remove();
    var tbody    = table.find("tbody.data-section");
    jQuery.each(data, function()
    {
      var row = this.component;
      tbody.append("<tr class='data'><td>" + row.item_number + "</td><td>" + row.component_class.description +"</td><td>" + row.component_brand.name + "</td><td>"+ row.jobber_price +"</td><td>"+row.msrp_price+"</td></tr>");
    });
  }

  // Convert the form parameters into a proper GET + query string
  function parameterize_url(form)
  {
    return [search_path, "?", form.serialize()].join("");
  }

  function replace_options(element, collection)
  {
    element.find("option").remove();
    collection.unshift(""); // Blank entry
    jQuery.each(collection, function()
    {
      element.append("<option>" + this + "</option>");
      if(this == element.data("choice"))
      {
        var last=element.children(":last");
        last.attr("selected", "selected");
      }
    });
  }

  // Fetch the component JSON
  function filter_components()
  {
    jQuery.get(parameterize_url(form), function(data) {
      var parsed  = jQuery.parseJSON(data);
      var makes   = jQuery.parseJSON(parsed[0]);
      var models  = jQuery.parseJSON(parsed[1]);
      var results = jQuery.parseJSON(parsed[2]);
      replace_options(make, makes);
      replace_options(model, models);
      fill_table(results);
      return false;
    });
  }

  // Add triggers to each dropdown
  function bind_events()
  {
    jQuery.each([year, make, model], function()
    {
      var thing=this;
      thing.bind("change", function()
      {
        var choice = jQuery(thing).val();
        thing.data("choice", choice);
        filter_components();
      });
    });
    return false;
  }

  bind_events();
});
