import React, { useContext, useState } from 'react';
import { Color, createColor } from 'material-ui-color';

interface categoryObj {
    value: string,
    label: string
}

interface recordObj {
    id: string,
    title: string,
    color_code: string,
    comment: string,
    label: string,
    value: string,
    record_ymd: string
}

export type GlobalContent = {
    userId: string
    setUserId: (data: string) => void
    openForm: boolean
    setOpenForm: (isOpen: boolean) => void
    date: any
    setDate: (date: any) => void
    categories: Array<categoryObj>
    setCategories: (categories: Array<categoryObj>) => void
    categoryId: string
    setCategoryId: (categoryId: string) => void
    categoryName: string
    setCategoryName: (categoryName: string) => void
    color: Color
    setColor: (color: Color) => void
    title: string
    setTitle: (title: string) => void
    comment: string
    setComment: (title: string) => void
    isRegistForm: boolean
    setIsRegistForm: (isRegistForm: boolean) => void
    contentId: string
    setContentId: (contentId: string) => void
    records: Array<recordObj>
    setRecords: (records: Array<recordObj>) => void
}
export const MyGlobalContext = React.createContext<GlobalContent>({
    openForm: false, // set a default value
    setOpenForm: () => { },
    userId: "",
    setUserId: () => {},
    date: new Date(),
    setDate: () => { },
    categories: [],
    setCategories: () => { },
    categoryId: "",
    setCategoryId: () => { },
    categoryName: "",
    setCategoryName: () => { },
    color: createColor("red"),
    setColor: (color: Color) => { },
    title: "",
    setTitle: () => { },
    comment: "",
    setComment: () => { },
    isRegistForm: false,
    setIsRegistForm: () => { },
    contentId: "",
    setContentId: () => { },
    records: [],
    setRecords: () => { },
})

export const useOepnRegistForm = (): GlobalContent => {
    // state名はThemeContext typeのプロパティに合わせる。
    const [openForm, setOpenForm] = useState(false);
    
    const [userId, setUserId] = useState("");

    const [date, setDate] = useState(new Date());

    const [categories, setCategories] = useState(new Array<categoryObj>());

    const [categoryId, setCategoryId] = useState("");

    const [categoryName, setCategoryName] = useState("");

    const [color, setColor] = useState(createColor("red"));

    const [title, setTitle] = useState("");

    const [comment, setComment] = useState("");

    const [isRegistForm, setIsRegistForm] = useState(false);

    const [contentId, setContentId] = useState("");

    const [records, setRecords] = useState(new Array<recordObj>());
    return {
        openForm,
        setOpenForm,
        userId,
        setUserId,
        date,
        setDate,
        categories,
        setCategories,
        categoryId,
        setCategoryId,
        categoryName,
        setCategoryName,
        color,
        setColor,
        title,
        setTitle,
        comment,
        setComment,
        isRegistForm,
        setIsRegistForm,
        contentId,
        setContentId,
        records,
        setRecords
    };
};

export const useGlobalContext = () => useContext(MyGlobalContext);