import { useContext, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {Toaster, toast} from 'react-hot-toast'

// import add from '../Images/add.png'
// import defaultBanner from '../Images/Blog Banner.png'

// import AnimationWrapper from '../Common/Page_animation'
// import { uploadImage } from '../Common/AWS'

import { EditorContext } from '../pages/Blog'

// import EditorJS from '@editorjs/editorjs';
// import { tools } from './Tools'

import axios from 'axios'
import { UserContext } from '../App'

const BlogEditor = () => {
  let {blog, blog:{title, banner, content, tags, des}, setBlog, textEditor, setTextEditor,setEditorState } = useContext(EditorContext)

  let {userAuth:{access_token}} = useContext(UserContext)

  let navigate = useNavigate();
  
  // use Effect 
  useEffect(() => {
    if(!textEditor.isReady){

      setTextEditor(new EditorJS({
        holderId: 'textEditor',
        data: content,
        tools: tools,
        placeholder: "Let's write an awesome story.... ",
      }))

    }
  }, [])

  // handle error 
  const handleError = (e) =>{
    let img = e.target;
    img.src = defaultBanner;
  }

  // Save Draft 
  const handleSaveDraft = (e) => {
    if(e.target.className.includes('disable')){
      return;
    }

    if(!title.length){
      return toast.error('Write blog title before it is saving for blog...')
    }

    let loadingToast = toast.loading('Saving Draft...')

    e.target.classList.add('disable');

    if(textEditor.isReady){
      textEditor.save().then(content =>{

        let blogObj = {
          title, banner,des, content, tags, draft:true
        }
console.log( title, banner,des, content, tags,' title, banner,des, content, tags')
      //   axios.post(import.meta.env.VITE_SERVER_NAME + '/create-blog', blogObj, {
      //     headers:{
      //       'Authorization':`Bearer ${access_token}`
      //     }
      //   })
      //   .then(()=> {
      //       e.target.classList.remove('disable');
      //       toast.dismiss(loadingToast);
      //       toast.success('Saved🙂')
      //       setTimeout(()=> {
      //         navigate('/')
      //       },5000)
      // })
      // .catch(({ response }) =>{
      //   e.target.classList.remove('disable');
      //   toast.dismiss(loadingToast);
      //   return toast.error(response.data.error)
      // })
      })
    }
  }

  // Title change 
  const handleTitleChange = (e) =>{
    // console.log(e);
    let input = e.target;
    input.style.height = 'auto';
    input.style.height = input.scrollHeight + 'px';
    setBlog({ ...blog, title: input.value })
  }
  
  // Title change 
  const handleContentsChange = (e) =>{
    const value= document.getElementById('textEditor').innerText
    console.log(value,'uuuuooooo');
    // input.style.height = 'auto';
    // input.style.height = input.scrollHeight + 'px';
    setBlog({ ...blog, content: value })
  }

  // Title key break 
  const handleTitleKeyDown = (e) => {
    // console.log(e);
    if(e.keyCode == 13){    // enter key 
      e.preventDefault();
    }
  }

  let blogBannerRef = useRef() 

// Banner image upload 
  const handleBannerUpload = (e) => {
    // console.log(e)
    let img = e.target.files[0];
    if(img){
      let loadingToast = toast.loading('Uploading...')
      uploadImage(img)
      .then((url) =>{
        if(url){
          toast.dismiss(loadingToast);
          toast.success('Uploaded ✌🏻')
          // blogBannerRef.current.src = url
          setBlog({...blog, banner: url})
        }
      })
      .catch(err =>{
        toast.dismiss(loadingToast);
        return toast.error(err);
      })
    }
    // console.log(img);
  }

  // Publish Event 
  const handlePublishEvent = () => {
    console.log('-=-=-=-=-=-=-',banner,title)
    if(!banner.length){
      return toast.error('Upload a blog banner');
    }

    if(!title.length){
      return toast.error('Write a title');
    } 

    // console.log(textEditor,'textEditor')
    if(textEditor.isReady){
      textEditor.save().then(data => {
        console.log(data,'ddddd');
        if(data.blocks.length){
          setBlog({...blog, content : data });
          setEditorState('publish')
        }
        else{
          return toast.error('write a blog post');
        }
      })
      .catch((err) =>{
        console.log(err);
      })
    }
  }

  return (
    <> 
    <nav className='navbar'>
      
      <Link to ='/' className='flex-none w-10'>
        <img src={add} />
        </Link> 

        <p className='max-md:hidden text-black line-clamp-1 w-full'>
          {title.length ? title : 'New Blog'}
        </p>

        <div className='flex gap-4 ml-auo'> 
          <button className='btn-dark py-2 ' onClick={handlePublishEvent}>
            Publishoo
          </button>
          
          <button className='btn-light py-2' onClick={handleSaveDraft}>
            Save draft 
          </button>
        </div>
    </nav>
    <Toaster/>
{console.log(content,'tttttttttttttttttttttttttt')}
    <AnimationWrapper>
      <section>

        <div className='mx-auto max-w-[900px] w-full'>

            <div className='relative aspect-video hover:opacity-80 bg-white border-4 border-grey'>

              <label htmlFor='uploadBanner'>

                <img 
                // ref={blogBannerRef}
                src={banner} 
                className='z-20'
                onError={handleError}
                />

                <input id='uploadBanner'
                type='file'
                accept='.png, .jpg, .jpeg, '
                hidden
                onChange={handleBannerUpload}
                />

              </label>
            </div>

            <textarea
              defaultValue={title}
            placeholder='Blog Title' className='text-4xl font-medium w-full h-20 outline-none resize-none mt-10 leading-tight placeholder: opacity-40' 
            onKeyDown={handleTitleKeyDown}
            onChange={handleTitleChange}
            >

            </textarea>

            <hr className='w-full opacity-10 my-5 '/>

            <div id='textEditor' className='font-gelasio' onKeyUp={handleContentsChange}
            >
            </div>

        </div>
      </section>
    </AnimationWrapper>

    </>
    
  )
}

export default BlogEditor