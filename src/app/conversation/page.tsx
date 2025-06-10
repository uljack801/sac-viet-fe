"use client"
import { useAuth } from "../AuthContext";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Input } from "@/components/ui/input";
import { FaRegCircleUser } from "react-icons/fa6";
import Image from "next/image";
import { useEffect, useState } from "react";
import { MdOutlineInsertComment } from "react-icons/md";
import { Textarea } from "@/components/ui/textarea";
import { FaEarthAsia } from "react-icons/fa6";
import { cn } from "@/lib/utils";
import { NEXT_PUBLIC_LOCAL } from "../helper/constant";
import { uploadImage } from "../helper/uploadImage";
import { useConversations } from "./components/useConversations";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { SlLike } from "react-icons/sl";
import { GoCommentDiscussion } from "react-icons/go";
import { AiFillLike } from "react-icons/ai";
import { useRouter } from "next/navigation";
import { BsArrowRightCircleFill } from "react-icons/bs";
import { ArticleList } from "../components/home/ArticleList";
import { ArticleProps } from "../utils/fetchCategory";
import { getArticle } from "./components/fetchArticle";


export default function Conversation() {
    const { dataUser, accessToken } = useAuth();
    const [openPost, setOpenPost] = useState(false);
    const [openPostImg, setOpenPostImg] = useState(false);
    const [valueImg, setValueImg] = useState<File | null>(null);
    const [previewImg, setPreviewImg] = useState<string | null>(null);
    const [valueContent, setValueContent] = useState('')
    const [loading, setLoading] = useState(false);
    const [openComment, setOpenComment] = useState<{ status: boolean, postID: string }>();
    const [valueComment, setValueComment] = useState('')
    const [addComment, setAddComment] = useState(6)
    const route = useRouter()
    const queryClient = useQueryClient();
    const [openReplyComment, setOpenReplyComment] = useState<{ status: boolean, postID: string, commentID: string }>();
    const [valueReplyComment, setValueReplyComment] = useState('')
    const [addReplyComment, setAddReplyComment] = useState(6)
    const [article, setArticle] = useState<ArticleProps | undefined>();

    const { data: allConversation, isLoading } = useConversations();
    const getData = async () => {
        const data = await getArticle()
        setArticle(data)
    }
    useEffect(() => {
        if (!article) {
            getData()
        }
    }, [article])

    const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setValueImg(file);
            setPreviewImg(URL.createObjectURL(file));
        }
    }

    const postConversation = async ({ content, image }: { content: string; image?: string }) => {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/add-conversation`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ content, image, name: dataUser?.data.fullname || dataUser?.data.account }),
        });
        if (!res.ok) throw new Error('Lỗi đăng bài');
        return res.json();
    };

    const mutation = useMutation({
        mutationFn: postConversation,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
            setOpenPost(false);
            setValueImg(null);
            setPreviewImg('');
            setValueContent('');
            setOpenPostImg(false);
        },
    });


    const handlePost = async () => {
        if (valueImg === null && valueContent.trim() === '') return;
        if (loading) return;

        try {
            setLoading(true);
            let uploadedImageUrl = '';
            if (valueImg) {
                uploadedImageUrl = await uploadImage(valueImg);
            }
            mutation.mutate({ content: valueContent, image: uploadedImageUrl });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const likeConversation = async ({ postID, accessToken }: { postID: string; accessToken: string | null }) => {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-like-post`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ postID }),
        });

        if (!res.ok) throw new Error("Like thất bại");
        return res.json();
    };

    const mutationLike = useMutation({
        mutationFn: ({ postID }: { postID: string }) => likeConversation({ postID, accessToken }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });
    const handleLikePost = (postID: string) => {
        if (!accessToken) return route.push('/login');
        mutationLike.mutate({ postID });
    };

    const postComment = async ({ postID, accessToken }: { postID: string; accessToken: string | null }) => {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/add-comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                postID,
                name: dataUser?.data.fullname || dataUser?.data.account,
                comment: valueComment
            })
        })
        if (!res.ok) throw new Error("Like thất bại");
        setValueComment('')
        return res.json();
    }
    const mutationPostComment = useMutation({
        mutationFn: ({ postID }: { postID: string }) => postComment({ postID, accessToken }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
    })
    const handlePostComment = (postID: string) => {
        if (!accessToken) return route.push('/login');
        mutationPostComment.mutate({ postID });
    }
    useEffect(() => setAddComment(6), [openComment?.postID])

    const likeComment = async ({ postID, commentID, accessToken }: { postID: string; commentID: string, accessToken: string | null }) => {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/patch/update-like-comment`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({
                postID,
                commentID
            }),
        });

        if (!res.ok) throw new Error("Like thất bại");
        return res.json();
    };

    const mutationLikeComment = useMutation({
        mutationFn: ({ postID, commentID }: { postID: string, commentID: string }) => likeComment({ postID, commentID, accessToken }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] });
        },
    });


    const handleLikeCommnet = (postID: string, commentID: string) => {
        if (!accessToken) return route.push('/login');
        mutationLikeComment.mutate({ postID, commentID });
    }


    const postReplyComment = async ({ postID, commentID, accessToken }: { postID: string; commentID: string, accessToken: string | null }) => {
        const res = await fetch(`${NEXT_PUBLIC_LOCAL}/api/post/add-reply-comment`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`
            },
            body: JSON.stringify({
                postID,
                name: dataUser?.data.fullname || dataUser?.data.account,
                comment: valueReplyComment,
                commentID
            })
        })
        if (!res.ok) throw new Error("Like thất bại");
        setValueReplyComment('')
        return res.json();
    }
    const mutationPostReplyComment = useMutation({
        mutationFn: ({ postID, commentID }: { postID: string, commentID: string }) => postReplyComment({ postID, commentID, accessToken }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['conversations'] })
        }
    })

    const handlePostReplyComment = (postID: string, commentID: string) => {
        if (!accessToken) return route.push('/login');
        mutationPostReplyComment.mutate({ postID, commentID });
    }
    return (
        <div className="mt-28 mb-10 shadow rounded-sm  min-h-screen bg-white  grid grid-cols-3 max-xl:mx-0 max-[1540px]:mx-36 mx-96">
            <span  onClick={() => route.push('/')} className="flex text-xs items-center ml-2 mt-2 col-span-3 max-sm:block  max-xl:hidden max-[1540px]:hidden">
                Trang chủ / <strong className="ml-1">Tin tức</strong> 
            </span>
            <div className="col-span-2 p-10 max-sm:p-2 max-sm:col-span-3 max-sm:text-xs max-lg:col-span-3 max-lg:text-sm">
                {dataUser &&
                    <div className="w-full bg-neutral-100/50 border max-sm:p-4 p-10 pb-2 rounded-2xl ">
                        <div className="flex justify-center items-center">
                            <FaRegCircleUser className="w-8 h-8 text-gray-500" />
                            <AlertDialog open={openPost} onOpenChange={setOpenPost}>
                                <div className="w-full">
                                    <Input onClick={() => setOpenPost(true)} className="mt-0 ml-2 rounded-3xl" placeholder={`${dataUser.data.fullname || dataUser.data.account} ơi, bạn đang nghĩ gì thế?`} />
                                </div>
                                <AlertDialogContent className="max-h-[600px] overflow-auto p-0 rounded-sm">
                                    <AlertDialogHeader>
                                        <div className="p-10">
                                            <AlertDialogTitle className="flex justify-center font-medium text-xl pb-4 border-b ">Tạo bài viết</AlertDialogTitle>
                                            <div className="flex items-center mb-4 mt-1">
                                                <FaRegCircleUser className="w-8 h-8 text-gray-500" />
                                                <div className="ml-2">
                                                    <p className="text-sm">{dataUser.data.fullname || dataUser.data.account}</p>
                                                    <p className="text-xs flex items-center"><FaEarthAsia className="mr-2" />Công khai</p>
                                                </div>
                                            </div>
                                            <Textarea className="mt-0 p-0 focus-visible:ring-0 border-0 shadow-none max-w-[410px]" onChange={(e) => setValueContent(e.target.value)} placeholder={`${dataUser.data.fullname || dataUser.data.account} ơi, bạn đang nghĩ gì thế?`} />
                                            {openPostImg && (
                                                <div className="mt-4">
                                                    {previewImg && (
                                                        <Image
                                                            src={previewImg}
                                                            alt="image-post"
                                                            height={200}
                                                            width={200}
                                                            className="rounded-xl w-full h-full object-cover"
                                                        />
                                                    )}
                                                    <Input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleChangeImage}
                                                        className="mt-4 rounded-3xl flex justify-center items-center"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="sticky -bottom-1  p-4 w-full bg-white border-t z-50 rounded-b-2xl flex">
                                        <div className={cn("flex justify-between w-full", openPostImg && "justify-end")}>
                                            {!openPostImg &&
                                                <div className="flex items-center cursor-pointer ml-2 " onClick={() => (setOpenPost(true), setOpenPostImg(true))}>
                                                    <Image src={`/iconImage.png`} alt="icon" height={24} width={24} />
                                                    <span className="ml-2">Thêm ảnh</span>
                                                </div>
                                            }
                                            <div>
                                                <AlertDialogCancel onClick={() => (setOpenPost(false), setOpenPostImg(false), setPreviewImg(''), setValueContent(''))}>Hủy</AlertDialogCancel>
                                                <AlertDialogAction className="bg-[var(--color-button)] hover:bg-[var(--color-button)] ml-2" onClick={handlePost} >Đăng bài</AlertDialogAction>
                                            </div>
                                        </div>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        </div>
                        <div className="flex justify-end items-center mt-4 max-sm:mt-1">
                            <div className="flex items-center cursor-pointer " onClick={() => (setOpenPost(true), setOpenPostImg(true))}>
                                <Image src={`/iconImage.png`} alt="icon" height={24} width={24} />
                                <span className="ml-2">Thêm ảnh</span>
                            </div>
                            <div className="flex items-center cursor-pointer ml-6" onClick={() => setOpenPost(true)}>
                                <MdOutlineInsertComment className="text-xl" />
                                <span className="ml-2">Thêm nội dung</span>
                            </div>
                        </div>
                    </div>
                }
                {!accessToken &&
                    <p className="cursor-pointer py-2 bg-neutral-100/50 flex justify-center rounded-2xl border font-medium" onClick={() => route.push('/login')}>Đăng nhập để tham gia cuộc trò truyện!</p>
                }
                <div>
                    {!isLoading && allConversation?.data.slice().reverse().map((post) => {
                        const findUser = post.likes.some(value => value.user === dataUser?.data._id)
                        const dateCreateAt = new Date(post.createdAt)
                        return (
                            <div key={post._id} className="w-full p-4 bg-neutral-100/50 border mt-4 rounded-2xl">
                                <div className="w-full flex flex-col justify-center">
                                    <div className="flex items-center mb-4">
                                        <FaRegCircleUser className="w-8 h-8 text-gray-500" />
                                        <div className="ml-2">
                                            <p className="text-lg font-medium">{post.name}</p>
                                            <span className="text-xs flex items-center">{dateCreateAt.toLocaleDateString()} {dateCreateAt.toLocaleTimeString()}<FaEarthAsia className="ml-2" /></span>
                                        </div>
                                    </div>
                                    <p className="text-sm mb-4 max-sm:text-xs">{post.content}</p>
                                    <div className="flex w-full justify-center">
                                        {post.image[0].trim() !== '' &&
                                            <Image
                                                src={post.image[0]}
                                                alt="image-post"
                                                height={480}
                                                width={480}
                                                className="rounded-xl object-cover"
                                            />
                                        }
                                    </div>
                                </div>
                                {post.likes.length ? <span className="test-sm flex items-center my-1 ml-2"><AiFillLike className="mr-1 text-blue-500" />{post.likes.length}</span> : <div className="h-6 my-1"></div>}
                                <hr />
                                <div className="flex items-center my-1">
                                    {!findUser ?
                                        <div className="flex items-center px-8 py-2 hover:bg-neutral-300/50 hover:rounded-sm cursor-pointer" onClick={() => handleLikePost(post._id)}><SlLike className="mr-2" />Thích</div>
                                        :
                                        <div className="flex items-center px-8 py-2 hover:bg-neutral-300/50 hover:rounded-sm cursor-pointer text-blue-500" onClick={() => handleLikePost(post._id)}><AiFillLike className="mr-2 text-blue-500" />Thích</div>
                                    }
                                    <div className="flex items-center px-8 py-2 hover:bg-neutral-300/50 hover:rounded-sm cursor-pointer" onClick={() => setOpenComment({ status: post._id !== openComment?.postID ? true : !openComment?.status, postID: post._id })}><GoCommentDiscussion className="mr-2" />Bình luận</div>
                                </div>
                                <hr />
                                {openComment?.status && openComment.postID === post._id &&
                                    <div className="mt-2">
                                        <div className="">
                                            {post.comments.length > 6 && <p className="text-xs cursor-pointer" onClick={() => setAddComment(addComment + 6)}>Xem thêm bình luận</p>}
                                            {[...post.comments].reverse().slice(0, addComment).map(comment => {
                                                const commentCreateAt = new Date(comment.createdAt)
                                                const findUserComment = comment.likes.some(value => value.user === dataUser?.data._id)
                                                return (
                                                    <div key={comment._id} className="sticky flex flex-col mt-4 ">
                                                        <div className="flex gap-2">
                                                            <FaRegCircleUser className="w-8 h-8 text-gray-500 shrink-0" />
                                                            <div className="flex-1 relative w-11/12 bg-neutral-200/40 p-2 rounded-sm">
                                                                <p className="text-sm font-medium">{comment.name}</p>
                                                                <p className="text-sm">{comment.comment}</p>
                                                            </div>
                                                        </div>
                                                        <div className="text-xs ml-10 flex items-center">
                                                            {comment.likes.length ? <span className="test-sm flex items-center mr-2">{comment.likes.length}</span> : <div className=""></div>}
                                                            <div className="flex items-center my-1">
                                                                {!findUserComment ?
                                                                    <div className="flex items-center cursor-pointer mr-4" onClick={() => handleLikeCommnet(post._id, comment._id)}><SlLike className="mr-2" />Thích</div>
                                                                    :
                                                                    <div className="flex items-center cursor-pointer text-blue-500 mr-4" onClick={() => handleLikeCommnet(post._id, comment._id)}><AiFillLike className="mr-2 text-blue-500" />Thích</div>
                                                                }
                                                                <div className="flex items-center cursor-pointer mr-4" onClick={() => setOpenReplyComment({ status: comment._id !== openReplyComment?.commentID ? true : !openReplyComment?.status, postID: post._id, commentID: comment._id })}><GoCommentDiscussion className="mr-2" />Trả lời</div>
                                                            </div>
                                                            <p>{commentCreateAt.toLocaleDateString()} -</p>
                                                            <p> {commentCreateAt.toLocaleTimeString()}</p>
                                                        </div>
                                                        {openReplyComment?.status && openReplyComment.commentID === comment._id &&
                                                            <div>
                                                                {comment.reply.length > 6 && <p className="text-xs cursor-pointer ml-10" onClick={() => setAddReplyComment(addReplyComment + 6)}>Xem thêm bình luận</p>}
                                                                {[...comment.reply].reverse().slice(0, addReplyComment).map(reply => {
                                                                    return (
                                                                        <div key={reply._id} className="">
                                                                            <div className="flex gap-2 mt-2 ml-10">
                                                                                <FaRegCircleUser className="w-8 h-8 text-gray-500 shrink-0" />
                                                                                <div className="flex-1 relative w-11/12 bg-neutral-200/40 p-2 rounded-sm">
                                                                                    <p className="text-sm font-medium">{reply.name}</p>
                                                                                    <p className="text-sm">{reply.comment}</p>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    )
                                                                })}
                                                                <div className="flex gap-2 ml-10 mt-4">
                                                                    <FaRegCircleUser className="w-8 h-8 text-gray-500 shrink-0" />
                                                                    <div className="flex-1 relative w-11/12">
                                                                        <Textarea className="w-full resize-none pr-14" placeholder="Viết phản hồi..." value={valueReplyComment}
                                                                            onChange={(e) => setValueReplyComment(e.target.value)}
                                                                            onKeyDown={(e) => {
                                                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                                                    e.preventDefault();
                                                                                    handlePostReplyComment(post._id, comment._id)
                                                                                }
                                                                            }}
                                                                        />
                                                                        <BsArrowRightCircleFill
                                                                            className="text-2xl absolute top-1/2 right-2 -translate-y-1/2 z-10 cursor-pointer"
                                                                            onClick={() => handlePostReplyComment(post._id, comment._id)}
                                                                        />
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        }

                                                    </div>
                                                )
                                            }
                                            )}
                                        </div>
                                        <div className="sticky flex mt-10 gap-2">
                                            <FaRegCircleUser className="w-8 h-8 text-gray-500 shrink-0" />
                                            <div className="flex-1 relative w-11/12">
                                                <Textarea className="w-full resize-none pr-14"
                                                    placeholder="Viết bình luận..." value={valueComment}
                                                    onChange={(e) => setValueComment(e.target.value)}
                                                    onKeyDown={(e) => {
                                                        if (e.key === 'Enter' && !e.shiftKey) {
                                                            e.preventDefault();
                                                            handlePostComment(post._id)
                                                        }
                                                    }}
                                                />
                                                <BsArrowRightCircleFill
                                                    className="text-2xl absolute top-1/2 right-2 -translate-y-1/2 z-10 cursor-pointer"
                                                    onClick={() => handlePostComment(post._id)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                }
                            </div>
                        )

                    })
                    }

                </div>
            </div>
            <div className="col-span-1 pt-10 pr-10 max-sm:hidden max-lg:hidden">
                <div className=" bg-neutral-100/50 w-full min-h-screen shadow rounded-2xl ">
                    <p className="text-2xl font-medium flex justify-center p-4">Bài báo mới cập nhật</p>
                    <ArticleList article={article} />
                </div>
            </div>
        </div>
    )
}