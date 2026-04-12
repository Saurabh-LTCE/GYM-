import React from 'react';
import { Link } from 'react-router-dom';

/**
 * Dashboard stat card — white surface, shadow, hover lift.
 *
 * @param {React.ReactNode} [props.icon] — optional icon node
 */
const Card = ({ title, value, hint, to, linkLabel = 'View', icon }) => (
  <article className="stat-card brutal-card">
    <div className="stat-card__top">
      {icon && <div className="stat-card__icon-wrap">{icon}</div>}
      <div className="stat-card__body">
        <h3 className="stat-card__title">{title}</h3>
        <p className="stat-card__value">{value}</p>
      </div>
    </div>
    {hint && <p className="stat-card__hint">{hint}</p>}
    {to && (
      <Link className="stat-card__link" to={to}>
        {linkLabel}
        <span className="stat-card__arrow" aria-hidden>
          →
        </span>
      </Link>
    )}
  </article>
);

export default Card;
