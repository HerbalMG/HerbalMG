import { useContext } from 'react'
import { useNavigate } from 'react-router-dom';
import {Toaster, toast} from 'react-hot-toast'

import { EditorContext } from '../pages/Blog';
// import AnimationWrapper from '../Common/Page_animation'
// import Tag from './Tag';
// import axios from 'axios';
import { UserContext } from '../App';

const PublishForm = () => {

  let characterLimit = 200;
  let tagLimit = 2;

  let {blog:{banner, title, tags, des, content} ,setEditorState, setBlog} = useContext(EditorContext);

  let { userAuth:{access_token}} = useContext(UserContext)

  let navigate = useNavigate();

  const handleCloseEvent = () => {
    setEditorState('editor');
  }
// console.log(banner, title, tags, des,'heyyyy')
  const handleBlogTitleChange = (e) => {
    let input = e.target;
// console.log(input,'input',banner,title,tags,des)
    setBlog({banner:banner,tags:tags,des:des,title: input.value});
  }

  const handleBlogDesChange = (e) =>{
    let input = e.target;
    setBlog({banner:banner,tags:tags,title:title, des: input.value});
  }

  const handleTitleKeyDown = (e) => {
    // console.log(e);
    if(e.keyCode == 13){    // enter key 
      e.preventDefault();
    }
  }


  const handleKeyDown = (e) => {
    // console.log(e.keyCode,'cccccc')
    if(e.keyCode == 13 || e.keyCode == 188) {
      e.preventDefault();
      
      let tag = e.target.value;
      
      if(tags.length < tagLimit){
        // console.log('1111',tags,tag)
        if(!tags.includes(tag)){
          // console.log(tags,tag,'=-=---9999999',[...tags, tag])
          setBlog({banner:banner,des:des,title:title,tags:[...tags, tag]});
        }
      }else{
        toast.error(`you can add max ${tagLimit} Tags`)
      }
      e.target.value = '';
    }
  }

  const publishBlog = (e) =>{

    if(e.target.className.includes('disable')){
      return;
    }

    if(!title.length){
      return toast.error('Write blog title before publishing')
    }

    if(!des.length || des.length > characterLimit){
      return toast.error(`Write a description about your blog within ${characterLimit} characters to publish` )
    }

    if(!tags.length || tags.length > 10){
      return toast.error('Please enter at least 1 tag to rank your blog.')
    }

    let loadingToast = toast.loading('Publishing...')

    e.target.classList.add('disable');

    let blogObj = {
      title, banner,des, content, tags, draft:false
    }
    // console.log('content', content)

    axios.post(import.meta.env.VITE_SERVER_NAME + "/create-blog", blogObj, {
      headers:{
        'Authorization':`Bearer ${access_token}`
      }
    })
    .then(()=> {
        e.target.classList.remove('disable');

        toast.dismiss(loadingToast);
        toast.success('Published🤩')

        setTimeout(()=> {
          navigate('/')
        },5000)
  })
  .catch(({ response }) =>{
    e.target.classList.remove('disable');
    toast.dismiss(loadingToast);
    return toast.error(response.data.error)
  })
}

  return (
    <AnimationWrapper>

      <section className='w-screen min-h-screen grid items-center lg:grid-cols-2 py-16 lg:gap-4'>

          <Toaster/>

        <button className='w-12 h-12 absolute right-[5vw] z-10 top-[5%] lg:top-[10%]' onClick={handleCloseEvent}>
        {/* <i className="fi fi-bs-times-hexagon"></i> */}
        <i className="fi fi-br-cross"></i>
        </button>

        <div className='max-w-[550px] center'>
          <p className='text-dark-grey mb-1'>Preview</p>

          <div className='w-full aspect-video rounded-lg overflow-hidden bg-grey mt-4'>
            <img src={banner} />
          </div>

          <h1 className='text-4xl font-medium mt-2 leading-tight line-clamp-2'>{title}</h1>

          <p className='font-gelasio line-clamp-2 text-xl leading-7 mt-4'>{des}</p>
        </div>

        <div className='border-grey lg:border-1 lg:pl-8 '>

          <p className='text-dark-grey nb-2 mt-9'>Blog Title</p>
          <input type="text" 
          placeholder='blog title' 
          defaultValue={title} className='input-box pl-4 '
          onChange={handleBlogTitleChange}
          />
          
          <p className='text-dark-grey nb-2 mt-9'>Short description about your blog</p>
          <textarea maxLength={characterLimit} 
          defaultValue={des} className='h-40 resize-none leading-7 input-box pl-4'
          onChange={handleBlogDesChange}
          onKeyDown={handleTitleKeyDown}
          />
          {console.log(characterLimit,des,'=-=-=-=',des&&des.length || 0,characterLimit - (des&&des.length))}
          <p className='mt-1 text-dark-grey text-sm text-right'>{ characterLimit - (des&&des.length || 0 )} character left</p>

          <p className='text-dark-grey nb-2 mt-9' >Topics - (Help in searching and tracking your blogs.)</p>

          <div className='relative input-box pl-2 py-2 pb-4 '>
              <input type="text" placeholder='Topics' className='sticky input-box bg-white top-0 left-0 pl-4 mb-3 focus:bg-white' 
              onKeyDown={handleKeyDown}
              />
              {console.log(tags,'tags')}
              {/* <Tag tags='testing tag'/>  */}
              {
              tags && tags.length>0&&tags.map((tag,i) => {
               return <Tag tag={tag} tagIndex={i} key={i}/>
              })
              }
          </div>

              <p className='mt-1 mb-4 text-dark-grey text-right'>{tagLimit - (tags && tags.length)} Tags left</p>
            
            <button className='btn-dark px-8' onClick={publishBlog}>  Publish </button>

        </div>

      </section>
    </AnimationWrapper>
  )
}

export default PublishForm