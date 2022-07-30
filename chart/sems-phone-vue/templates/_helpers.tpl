{{- define "service.labels.standard" -}}
app.poros-vue-cli.io/release: {{ .Release.Name | quote }}
{{- end -}}

{{- define "service.logging.deployment.label" -}}
app.poros-vue-cli.io/logs-parser: {{ .Values.logs.parser | quote }}
{{- end -}}

{{- define "app.deployment.apiVersion" -}}
{{- if semverCompare "<1.9-0" .Capabilities.KubeVersion.GitVersion -}}
{{- print "apps/v1beta2" -}}
{{- else -}}
{{- print "apps/v1" -}}
{{- end -}}
{{- end -}}