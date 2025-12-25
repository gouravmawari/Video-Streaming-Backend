const Series_schema = require('../../../database/models/Series');
const SeriesVideo_schema = require('../../../database/models/SeriesVideo');

//start or create series
const createSeriesService =  async (name,Discription,season)=>{
  try{
      const already = await Series_schema.findOne({name});
      if(already){
          return {
              status: 503,
              data:{message:"same series name already exist"}
          }
      }
      const prefix = "series_";
      const uniqueId = new mongoose.Types.ObjectId();
      const customId = `${prefix}${uniqueId}`;
      const Save =  new Series_schema({_id:customId,Name:name,Discription,season});
      const id = await Save.save();
      return {
          status:200,
          data:{
              message:"series added successfully",
              id
          }
      }
  }catch(error){
      throw new Error(error.mesasge);
  }
}


//Add video to series
const addEpisodeToSeriesService =  async(filename,filePath,size,Discription,series_name) => {
  try{
      const series_id  = await Series_schema.findOne(series_name);
      if(!series_id){
          return {
              status:401,
              data:{
                  message:"wrong series name",
              },
          };
      }
      //uploading video in Database 
      const video = new SeriesVideo_schema({filename,path:filePath,size,Discription,series:series_id});
      await video.save();
      //upgrade 
      await Series_schema.findByIdAndUpdate(
          series._id,
          { $push: { episodes: video._id } }, // Correct $push syntax
          { new: true, useFindAndModify: false } // options recommended
        );
      return {
          status:201,
          data:{
              message:"video uploaded successfully",
              video,
          },
      };
  }catch(error){
      throw new Error(error.message);
  }
}

module.exports = { createSeriesService, addEpisodeToSeriesService };
