#!/bin/sh

command=$1
YVM_DIR=${YVM_DIR-"${HOME}/.yvm"}

yvm_use() {
    local PROVIDED_VERSION=${1-$(head -n 1 .yvmrc)}
    PATH=$(yvm get-path ${PROVIDED_VERSION})
    echo "Set yarn version to ${PROVIDED_VERSION}"
}

yvm_echo() {
    command printf %s\\n "$*" 2>/dev/null
}

yvm_err() {
    >&2 yvm_echo "$@"
}

case "$-" in
    *i*) interactive=1;;
    *) interactive=0;;
esac

yvm_() {
    mode=$1
    shift 1

    command=$1
    if [ "${command}" = "use" ]; then
        if [ "${mode}" = 'script' ]; then
            yvm_err '"yvm use" can only be used when yvm is a shell function, not a script. Did you forget to source yvm?'
            exit 1
        fi
        yvm_use $2
    elif [ "${command}" = "update-self" ]; then
        curl https://raw.githubusercontent.com/tophatmonocle/yvm/master/scripts/install.sh | YVM_INSTALL_DIR=${YVM_DIR} bash
    else
        node "${YVM_DIR}/yvm.js" $@
    fi
}

if [ ${interactive} = 1 ]; then
    yvm() {
        yvm_ 'function' $@
    }
else
    yvm_ 'script' $@
fi
