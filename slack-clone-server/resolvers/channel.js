export default {
  Query: {},
  Mutation: {
    createChannel:(parent,args,{models})=>{
      try{
        await models.Channel.create(args)
        return true
      }catch(e){
        console.log(e)
        return false
      }
    }
  },
};
