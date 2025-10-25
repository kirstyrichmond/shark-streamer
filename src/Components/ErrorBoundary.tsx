import { ErrorBoundary } from 'react-error-boundary';
import { ErrorContainer, ErrorMessage, ErrorTitle, RetryButton } from '../styles/ErrorBoundary.styles';

const ErrorFallback = ({ 
  error, 
  resetErrorBoundary, 
  title, 
  message, 
  showRetry = true 
}: { 
  error: Error; 
  resetErrorBoundary: () => void; 
  title?: string; 
  message?: string; 
  showRetry?: boolean; 
}) => (
  <ErrorContainer>
    <ErrorTitle>
      {title || 'Something went wrong'}
    </ErrorTitle>
    <ErrorMessage>
      {message || 'We encountered an error loading this content. Please try again.'}
    </ErrorMessage>
    {showRetry && (
      <RetryButton onClick={resetErrorBoundary}>
        Try Again
      </RetryButton>
    )}
    {process.env.NODE_ENV === 'development' && error && (
      <details style={{ marginTop: '1rem', textAlign: 'left' }}>
        <summary style={{ cursor: 'pointer', color: '#e50914' }}>
          Debug Info (Development Only)
        </summary>
        <pre style={{ 
          background: '#333', 
          padding: '1rem', 
          borderRadius: '4px',
          fontSize: '0.8rem',
          overflow: 'auto',
          maxHeight: '200px'
        }}>
          {error.toString()}
          {'\n'}
          {error.stack}
        </pre>
      </details>
    )}
  </ErrorContainer>
);

const CustomErrorBoundary = ({ 
  children, 
  title, 
  message, 
  showRetry, 
  fallback, 
  onError, 
  onRetry 
}: { 
  children: React.ReactNode; 
  title?: string; 
  message?: string; 
  showRetry?: boolean; 
  fallback?: React.ComponentType<any>; 
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void; 
  onRetry?: () => void; 
}) => (
  <ErrorBoundary
    FallbackComponent={fallback || ((props) => (
      <ErrorFallback 
        {...props} 
        title={title} 
        message={message} 
        showRetry={showRetry} 
      />
    ))}
    onError={(error, errorInfo) => {
      console.error('ErrorBoundary caught an error:', error, errorInfo);
      onError?.(error, errorInfo);
    }}
    onReset={() => {
      onRetry?.();
    }}
  >
    {children}
  </ErrorBoundary>
);

export const RowErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <CustomErrorBoundary
    title="Content Row Error"
    message="Unable to load this row of content. This might be due to a network issue or invalid data."
    onError={(error) => {
      console.error('Row component error:', error);
    }}
  >
    {children}
  </CustomErrorBoundary>
);

export const MovieModalErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <CustomErrorBoundary
    title="Movie Details Error"
    message="Unable to load movie details. Please close this modal and try again."
    onError={(error) => {
      console.error('MovieModal component error:', error);
    }}
  >
    {children}
  </CustomErrorBoundary>
);

const ImageFallback = () => (
  <div style={{
    width: '100%',
    height: '200px',
    backgroundColor: '#333',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#666',
    borderRadius: '4px'
  }}>
    Image not available
  </div>
);

export const ImageErrorBoundary = ({ children }: { children: React.ReactNode }) => (
  <CustomErrorBoundary
    title="Image Loading Error"
    message="Unable to load image content."
    showRetry={false}
    fallback={ImageFallback}
    onError={(error) => {
      console.error('Image component error:', error);
    }}
  >
    {children}
  </CustomErrorBoundary>
);

export default CustomErrorBoundary;