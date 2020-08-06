import merge from 'lodash/merge'
import range from 'lodash/range'

const calculateOrder = (columnCount, columnSize, index) => {
  const gridSize = columnCount * columnSize
  const currentColumn = Math.ceil((index / gridSize) * columnCount)

  return (
    (index - (currentColumn * columnSize - columnSize)) * columnCount +
    currentColumn -
    columnCount
  )
}

export default (
  { background, children, foreground, columns, styles },
  { colors, mediaQuery, scale, rhythm, justifyContent, treatments }
) => {
  const childrenCount = children ? children.length : 0
  const createColumns = () => {
    return Object.keys(columns).reduce((styles, breakpoint) => {
      const columnCount = columns[breakpoint]
      const columnSize = Math.ceil(childrenCount / columnCount)

      return {
        ...styles,
        [mediaQuery(breakpoint)]:
          childrenCount > 1
            ? {
              display: 'flex',
              flexWrap: 'wrap',
              '> .c11n-leaderboard-item': {
                width: `${100 / columnCount}%`,
                ...range(1, childrenCount + 1).reduce((acc, index) => {
                  return {
                    ...acc,
                    [`&:nth-of-type(${index})`]: {
                      order: calculateOrder(columnCount, columnSize, index)
                    }
                  }
                }, {})
              }
            }
            : {
              columnCount
            }
      }
    }, {})
  }

  const defaultStyles = {
    root: {
      backgroundColor: background && colors[background],
      color: foreground && colors[foreground],
      ...treatments.leaderboard
    },

    leaders: {
      counterReset: 'board',
      ...createColumns(),
      ...treatments.leaderboardLeaders
    },

    state: {
      display: 'flex',
      alignItems: 'flex-start',
      ...justifyContent('center'),
      padding: rhythm(2),
      fontSize: scale(-1),
      ...treatments.leaderboardState,

      '& > *': {
        margin: rhythm([0, 0.25])
      }
    }
  }

  return merge(defaultStyles, styles)
}
