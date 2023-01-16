import os

from django.db.models import FileField
from django.forms import forms
from django.template.defaultfilters import filesizeformat


class ContentTypeRestrictedFileField(FileField):
    def __init__(self, *args, **kwargs):
        self.content_types = kwargs.pop("content_types", [])
        self.max_upload_size = kwargs.pop("max_upload_size", 5242880)
        
        super(ContentTypeRestrictedFileField, self).__init__(*args, **kwargs)

    def clean(self, *args, **kwargs):
        data = super(ContentTypeRestrictedFileField, self).clean(*args, **kwargs)

        file = data.file
        try:
            content_type = file.content_type
            if content_type in self.content_types:
                if file._size > self.max_upload_size:
                    raise forms.ValidationError(f'Please keep filesize under {filesizeformat(self.max_upload_size)}. Current filesize {filesizeformat(file._size)}')
            else:
                raise forms.ValidationError('Filetype not supported.')
        except AttributeError:
            pass

        return data
