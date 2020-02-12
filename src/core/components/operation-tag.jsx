import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import Im from "immutable"
import { createDeepLinkPath, escapeDeepLinkPath, sanitizeUrl } from "core/utils"

export default class OperationTag extends React.Component {

  static defaultProps = {
    tagObj: Im.fromJS({}),
    tag: "",
  }

  static propTypes = {
    tagObj: ImPropTypes.map.isRequired,
    tag: PropTypes.string.isRequired,

    layoutSelectors: PropTypes.object.isRequired,
    layoutActions: PropTypes.object.isRequired,

    getConfigs: PropTypes.func.isRequired,
    getComponent: PropTypes.func.isRequired,

    children: PropTypes.element,
  }

  render() {
    const {
      tagObj,
      tag,
      children,

      layoutSelectors,
      layoutActions,
      getConfigs,
      getComponent,
    } = this.props

    let {
      docExpansion,
      deepLinking,
    } = getConfigs()

    const isDeepLinkingEnabled = deepLinking && deepLinking !== "false"

    const Collapse = getComponent("Collapse")
    const Markdown = getComponent("Markdown")
    const DeepLink = getComponent("DeepLink")
    const Link = getComponent("Link")

    let tagDescription = tagObj.getIn(["tagDetails", "description"], null)
    let tagExternalDocsDescription = tagObj.getIn(["tagDetails", "externalDocs", "description"])
    let tagExternalDocsUrl = tagObj.getIn(["tagDetails", "externalDocs", "url"])

    let isShownKey = ["operations-tag", tag]
    let showTag = layoutSelectors.isShown(isShownKey, docExpansion === "full" || docExpansion === "list")

    return (
      <div className={showTag ? "opblock-tag-section is-open" : "opblock-tag-section"} >

        <h4
          onClick={() => layoutActions.show(isShownKey, !showTag)}
          className={!tagDescription ? "opblock-tag no-desc" : "opblock-tag" }
          style={{ display: "flex", alignItems: "stretch", flexDirection: "column" }}
          id={isShownKey.map(v => escapeDeepLinkPath(v)).join("-")}
          data-tag={tag}
          data-is-open={showTag}
          >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <DeepLink
              enabled={isDeepLinkingEnabled}
              isShown={showTag}
              path={createDeepLinkPath(tag)}
              text={tag} />
            <button
              className="expand-operation"
              title={showTag ? "Collapse operation" : "Expand operation"}
              onClick={() => layoutActions.show(isShownKey, !showTag)}>

              <svg className="arrow" width="20" height="20">
                <use href={showTag ? "#large-arrow-down" : "#large-arrow"}
                     xlinkHref={showTag ? "#large-arrow-down" : "#large-arrow"} />
              </svg>
            </button>
          </div>
          <span style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }} >
          { !tagDescription ? <small></small> :
            <small style={{paddingLeft:0}} >
              <Markdown source={tagDescription} />
            </small>
          }

            <div>
              { !tagExternalDocsDescription ? null :
                <small>
                  { tagExternalDocsDescription }
                  { tagExternalDocsUrl ? ": " : null }
                  { tagExternalDocsUrl ?
                    <Link
                      href={sanitizeUrl(tagExternalDocsUrl)}
                      onClick={(e) => e.stopPropagation()}
                      target="_blank"
                    >{tagExternalDocsUrl}</Link> : null
                  }
                </small>
              }
            </div>
          </span>
        </h4>

        <Collapse isOpened={showTag}>
          {children}
        </Collapse>
      </div>
    )
  }
}
