# so we can use `eslint` without ./node_modules/.bin/eslint
SHELL := /bin/bash
export PATH := $(shell npm bin):$(PATH)

ARTIFACT_DIR?=artifacts
TEST_REPORTS_DIR?=$(ARTIFACT_DIR)/reports
BUILD_DIR?=$(ARTIFACT_DIR)/build

IGNORE = test.js,js.snap,.md,__tests__,mockdata,__mocks__
BABEL_FLAGS = src --out-dir $(BUILD_DIR) --copy-files --ignore $(IGNORE)

ifdef CI
	ESLINT_EXTRA_ARGS=--format junit --output-file $(TEST_REPORTS_DIR)/lint/eslint.junit.xml
	JEST_ENV_VARIABLES=JEST_SUITE_NAME=yvm JEST_JUNIT_OUTPUT=$(TEST_REPORTS_DIR)/tests/jest.junit.xml
	JEST_ARGS=--ci --maxWorkers=2 --reporters jest-junit
else
	ESLINT_EXTRA_ARGS=
	JEST_ENV_VARIABLES=
	JEST_ARGS=
endif

ESLINT_ARGS=--max-warnings 0 ${ESLINT_EXTRA_ARGS}

.PHONY: help
help:
	@echo "--------------------- Useful Commands for Development ----------------------"
	@echo "make help                            - show tasks you can run"
	@echo "make install                         - runs a set of scripts to ensure your environment is ready"
	@echo "make yvm-test                        - runs the yvm node app"
	@echo ""
	@echo "----------------------- Other Commands  -------------------------"
	@echo "make build                            - runs eslint"
	@echo "make lint                            - runs eslint"
	@echo "make lint-fix                        - runs eslint --fix"
	@echo "make test                            - runs the full test suite with jest"
	@echo "make test-coverage                   - creates a coverage report and opens it in your browser"


# ---- YVM Command Stuff ----

.PHONY: install
install:
	@use_local=true ./install.sh

.PHONY: yvm-test
yvm-test:
	@yvm
	echo $$-
	echo $$PS1


# ---- Infrastructure for Test/Deploy ----

# TODO: finish the babel stuff
.PHONY: build
build: node_modules
	babel $(BABEL_FLAGS)


# -------------- Linting --------------


.PHONY: lint
lint: node_modules
	eslint $(ESLINT_ARGS) .

.PHONY: lint-fix
lint-fix: node_modules
	eslint $(ESLINT_ARGS) --fix .


# -------------- Testing --------------

.PHONY: test
test: node_modules
	${JEST_ENV_VARIABLES} jest ${JEST_ARGS}

.PHONY: test-watch
test-watch: node_modules
	jest ${JEST_ARGS} --watch

.PHONY: test-coverage
test-coverage: node_modules
	jest ${JEST_ARGS} --coverage

.PHONY: test-snapshots
test-snapshots: node_modules
	jest ${JEST_ARGS} --updateSnapshot


# ----------------- Helpers ------------------

node_modules: package.json package-lock.json .nvmrc
	npm install
	touch node_modules

.PHONY: clean
clean:
	rm -rf ${ARTIFACT_DIR}
	rm -f ~/.babel.json
	rm -rf node_modules

