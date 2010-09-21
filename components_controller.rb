class ComponentsController < ApplicationController
  before_filter :set_filter_bucket, :only => [:index]

  before_filter :get_years,  :only => [:index]
  before_filter :get_makes,  :only => [:index]
  before_filter :get_models, :only => [:index]

  protected
  def set_filter_bucket
    @bucket = {}

    if params[:vehicle_year].present?
      @bucket[:for_year] = params[:vehicle_year]
    end

    if params[:vehicle_make_name].present?
      @bucket[:for_make] = params[:vehicle_make_name]
    end

    if params[:vehicle_model_name].present?
      @bucket[:for_model] = params[:vehicle_model_name]
    end

    if params[:item_number_is].present?
      @bucket[:for_item_number] = params[:item_number_is]
    end
    @search = Component.search(@bucket)
  end

  def get_years
    @years  = Vehicle.find(:all, :select => "year_id").map{|v| v.year_id }
  end

  def get_makes
    bucket = Vehicle
    if params[:vehicle_year].present?
      bucket = Vehicle.for_year(params[:vehicle_year])
    end
    @makes  = bucket.find(:all, :select => "DISTINCT vehicles.make_name").map{|v| v.make_name }.to_json
  end

  def get_models
    bucket = Vehicle
    if params[:vehicle_year].present?
      bucket = Vehicle.for_year(params[:vehicle_year])
    end

    if params[:vehicle_make_name].present?
      bucket = Vehicle.for_make(params[:vehicle_make_name])
    end
    @models  = bucket.find(:all, :select => "DISTINCT vehicles.model_name").map{|v| v.model_name }.to_json
  end

  public
  def index
    @vehicles   = Vehicle.all
    respond_to do |format|
      format.html do
        @components = @search.paginate(:page => params[:page])
      end

      format.js do
        @components = @search.paginate(:page => params[:page]).to_json(:include => [:component_class, :component_brand]) 
        results = []
        results << @makes
        results << @models
        results << @components
        results.flatten!
        render :text => results.to_json, :layout => false
      end
    end
  end
end
