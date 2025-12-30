import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { ButtonGroup } from '../../src/components/ButtonGroup'

describe('ButtonGroup', () => {
  const options = ['small', 'medium', 'large'] as const

  it('renders all options', () => {
    render(
      <ButtonGroup
        options={options}
        value="medium"
        onChange={() => {}}
      />
    )

    expect(screen.getByText('small')).toBeInTheDocument()
    expect(screen.getByText('medium')).toBeInTheDocument()
    expect(screen.getByText('large')).toBeInTheDocument()
  })

  it('applies active class to selected option', () => {
    render(
      <ButtonGroup
        options={options}
        value="medium"
        onChange={() => {}}
      />
    )

    expect(screen.getByText('medium')).toHaveClass('active')
    expect(screen.getByText('small')).not.toHaveClass('active')
    expect(screen.getByText('large')).not.toHaveClass('active')
  })

  it('calls onChange when option is clicked', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()

    render(
      <ButtonGroup
        options={options}
        value="medium"
        onChange={handleChange}
      />
    )

    await user.click(screen.getByText('large'))
    expect(handleChange).toHaveBeenCalledWith('large')
  })

  it('uses custom labels when provided', () => {
    const labels = {
      small: 'S',
      medium: 'M',
      large: 'L',
    }

    render(
      <ButtonGroup
        options={options}
        value="medium"
        onChange={() => {}}
        labels={labels}
      />
    )

    expect(screen.getByText('S')).toBeInTheDocument()
    expect(screen.getByText('M')).toBeInTheDocument()
    expect(screen.getByText('L')).toBeInTheDocument()
  })
})
