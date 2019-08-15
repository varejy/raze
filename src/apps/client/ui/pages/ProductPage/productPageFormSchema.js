import FormFieldInput from '../../components/Form/fields/FormFieldInput/FormFieldInput';
import FormFieldButton from '../../components/Form/fields/FormFieldButton/FormFieldButton';

export default function ({ setting: { buttonDisabled } }) {
    return {
        fields: [
            {
                component: FormFieldInput,
                name: 'email',
                placeholder: 'Введите е-мейл',
                theme: 'smallVersion',
                validators: [
                    { name: 'required' },
                    { name: 'email' }
                ]
            },
            {
                component: FormFieldButton,
                position: 'center',
                disabled: buttonDisabled,
                name: 'submit',
                title: 'отправить'
            }
        ]
    };
}
