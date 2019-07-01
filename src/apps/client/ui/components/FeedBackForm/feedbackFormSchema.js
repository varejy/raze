import FormFieldTextarea from '../Form/fields/FormFieldTextarea/FormFieldTextarea';
import FormFieldInput from '../Form/fields/FormFieldInput/FormFieldInput';
import FormFieldButton from '../Form/fields/FormFieldButton/FormFieldButton';
import FormFieldRating from '../Form/fields/FormFieldRating/FormFieldRating';

export default function () {
    return {
        fields: [
            {
                component: FormFieldInput,
                name: 'email',
                placeholder: 'Введите е-мейл',
                validators: [
                    { name: 'required' },
                    { name: 'email' }
                ]
            },
            {
                component: FormFieldInput,
                name: 'fio',
                placeholder: 'Введите имя',
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldTextarea,
                name: 'comment',
                placeholder: 'Ваш комментарий',
                rows: 3,
                maxLength: 300,
                validators: [
                    { name: 'required' }
                ]
            },
            {
                component: FormFieldButton,
                name: 'submit',
                title: 'отправить'
            },
            {
                component: FormFieldRating,
                name: 'rating',
                validators: [
                    { name: 'rating' }
                ]
            }
        ]
    };
}
