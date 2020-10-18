import useAxios from 'axios-hooks';
import { useFormik } from 'formik';
import React from 'react';
import { useAlert } from 'react-alert';

function PostWidgetForm({ onPostCrated }: { onPostCrated: () => void }) {
    const alert = useAlert()

    const [doPostReq, doPost] = useAxios({
        url: '/post/create',
        method: 'POST'
    }, { manual: true });

    const formik = useFormik({
        initialValues: {
            body: ''
        },
        onSubmit: data => {
            return doPost({ data })
                .then(() => {
                    alert.show('Post Created!')
                    onPostCrated()
                    formik.resetForm()
                })
        },
        validate: values => {
            const errors: any = {};
            if (!values.body) {
                errors.price = 'Required';
            }
            return errors;
        }
    });
    return (
        <>
            <form>
                <textarea
                    name="body"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.body}
                    className="form-control input-lg p-text-area"
                    rows={2}
                    placeholder="Whats in your mind today?"></textarea>
            </form>
            <div className="box-footer box-form">
                <button disabled={doPostReq.loading} style={{ color: 'white',backgroundColor: doPostReq.loading ? 'gray' : undefined }} onClick={() => formik.submitForm()} type="button" className="btn btn-azure pull-right">
                    {doPostReq.loading ? "Posting..." : "Post"}
                </button>
                <ul className="nav nav-pills">
                </ul>
            </div>
        </>
    );
}
export default PostWidgetForm;
