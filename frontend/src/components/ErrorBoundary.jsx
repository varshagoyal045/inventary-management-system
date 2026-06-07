import React from 'react'

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { error: null, info: null }
  }

  componentDidCatch(error, info) {
    this.setState({ error, info })
    // still log to console
    console.error('ErrorBoundary caught', error, info)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="page-container">
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">An error occurred</h2>
            <pre className="text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded text-red-600 overflow-auto">
              {this.state.error && this.state.error.toString()}
              {'\n'}
              {this.state.info?.componentStack}
            </pre>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}
