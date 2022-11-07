
const cloudinary = require('cloudinary');
const { StatusCodes } = require('http-status-codes');
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});
// to remove temp file
const  removeTemp = (path)=>{
    fs.unlinkSync(path)
}
const imageController = {
    uploadProfileImage: async (req, res)=>{
        try {
            if(!req.files || Object.keys(req.files).length === 0)
                return res.status(StatusCodes.BAD_REQUEST).json({ msg: "No files were attached"})
            const file = req.files.profileImg
            //res.json({ file })

            //validate file size
            if(file.size > 1 * 1024 * 1024){
                removeTemp(file.tempFilePath)
                return res.status(StatusCodes.BAD_REQUEST).json({msg: "file size must be lessthan 1Mb.."})
            }

            //validate file format
            if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg'){
                removeTemp(file.tempFilePath)
                return res.status(StatusCodes.BAD_REQUEST).json({msg: "only allow png and jpg files.."})
            }

            //upload logic
            await cloudinary.v2.uploader.upload(file.tempFilePath, { folder: "profile_img"}, (err,result)=>{
                if(err) res.status(StatusCodes.BAD_REQUEST).json({msg: err.messge})
                removeTemp(file.tempFilePath)
                return res.status(StatusCodes.OK).json({
                    public_id: result.public_id,
                    url: result.secure_url
                })
            })
        }catch (err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message})
        }
    },
    deleteProfileImage: async (req, res)=>{
        try {
             const { public_id } = req.body 

             if(!public_id)
                return res.status(StatusCodes.NOT_FOUND).json({msg: "No public id found"})
            
             await cloudinary.v2.uploader.destroy(public_id, (err, result)=> {
                if(err)
                    return res.status(StatusCodes.BAD_REQUEST).json({ msg: err.message})
                
                res.status(StatusCodes.OK).json({ msg: "Profile image successfully deleted"})
             })

        } catch (err){
            return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ msg: err.message})
        }
    },
}

module.exports = imageController